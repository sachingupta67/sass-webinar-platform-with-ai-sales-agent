"use server";

import { AttendedTypeEnum } from "@/lib/generated/prisma/enums";
import { onAuthenticateUser } from "./auth";
import { prisma } from "@/lib/prismaClient";

export const registerAttendee = async (formData: {
  name: string;
  email: string;
  webinarId: string;
}) => {
  const { name, email, webinarId } = formData;
  try {
    if (!webinarId || !email) {
      return {
        success: false,
        status: 400,
        message: "Invalid webinar ID or email ",
      };
    }
    const webinar = await prisma.webinar.findUnique({
      where: {
        id: webinarId,
      },
    });
    if (!webinar) {
      return {
        success: false,
        status: 404,
        message: "Webinar not found",
      };
    }
    // find or create the attendee by email
    let attendee = await prisma.attendee.findUnique({
      where: {
        email,
      },
    });
    if (!attendee) {
      attendee = await prisma.attendee.create({
        data: {
          name,
          email,
        },
      });
    }

    // check for exsiting attendance
    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        attendeeId: attendee.id,
        webinarId: webinar.id,
      },
      include: {
        user: true,
      },
    });
    if (existingAttendance) {
      return {
        success: true,
        status: 200,
        data: existingAttendance,
        message: "You are already registered for this webinar",
      };
    }

    // create attendance
    const attendance = await prisma.attendance.create({
      data: {
        attendedType: AttendedTypeEnum.REGISTERED,
        attendeeId: attendee.id,
        webinarId: webinar.id,
      },
      include: {
        user: true,
      },
    });

    // revalidatePath(`/${webinar.id}`);
    return {
      status: 200,
      data: attendance,
      message: "Attendee registered successfully",
    };
  } catch (error) {
    console.error("Error registering attendee:", error);
    return { status: 500, message: "Failed to register attendee" };
  }
};
