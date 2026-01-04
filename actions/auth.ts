"use server";

import { currentUser } from "@clerk/nextjs/server";
import { prisma as prismaClient } from "@/lib/prismaClient";

export async function onAuthenticateUser() {
  try {
    const user = await currentUser();

    // ---------------------------
    // 1. Validate Clerk User
    // ---------------------------
    if (!user) {
      return {
        status: 403,
        message: "Unauthorized:user not found",
      };
    }

    const email = user.emailAddresses?.[0]?.emailAddress;
    if (!email) {
      return {
        status: 400,
        message: "User email is missing from Clerk",
      };
    }

    // Avoid "undefined undefined" name issues
    const first = user.firstName ?? "";
    const last = user.lastName ?? "";
    const fullName = `${first} ${last}`.trim();

    // Prevent DB overflow (name < 10 chars)
    const safeName = fullName || "Unknown";

    // ---------------------------
    // 2. Check if user exists
    // ---------------------------
    const existingUser = await prismaClient.user.findUnique({
      where: { clerkId: user.id },
    });

    if (existingUser) {
      return {
        status: 200,
        user: existingUser,
      };
    }

    // ---------------------------
    // 3. Create new user
    // ---------------------------
    const newUser = await prismaClient.user.create({
      data: {
        clerkId: user.id,
        email,
        name: safeName,
        profileImage: user.imageUrl,
      },
    });

    return {
      status: 201,
      user: newUser,
    };
  } catch (error) {
    // ---------------------------
    // 4. Handle Prisma + Runtime Errors
    // ---------------------------

    const message =
      error instanceof Error ? error.message : "Unknown server error";

    console.error("Auth Error:", error);

    // Prisma-specific error
    if (typeof error === "object" && error?.code === "P2000") {
      return {
        status: 400,
        message: "Data too long for DB column. Check field length limits.",
      };
    }

    return {
      status: 500,
      message,
    };
  }
}
