import { prisma } from "@/lib/prismaClient";
import { stripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (!code || !state) {
      console.log("Stripe Connect Error:::::", { code, state });
      return NextResponse.redirect(
        new URL(
          `/settings?success=false&message=Missing+required+parameters`,
          request.url,
        ),
      );
    }

    console.log("Procedding Stripe connect callback::::", {
      code,
      stateId: state,
    });
    try {
      const response = await stripe.oauth.token({
        grant_type: "authorization_code",
        code,
      });

      if (!response.stripe_user_id) {
        throw new Error("Failed to retrieve Stripe User id");
      }

      await prisma.user.update({
        where: {
          id: state,
        },
        data: {
          stripeConnectId: response.stripe_user_id,
        },
      });
      console.log("Successfully connected stripe account:::;", {
        userId: state,
        stripeConnectedId: response.stripe_user_id,
      });
      return NextResponse.redirect(
        new URL(
          `/settings?success=true&message=Stripe+account+connected+successfully`,
          request.url,
        ),
      );
    } catch (err) {
      console.log("Stripe Connect Error:::2::", { code, state });
      return NextResponse.redirect(
        new URL(
          `/settings?success=false&message=${encodeURIComponent(
            err instanceof Error ? err.message : String(err),
          )}`,
          request.url,
        ),
      );
    }
  } catch (err) {
    console.log("Stripe Connect Error::3:::", { err });
    return NextResponse.redirect(
      new URL(
        `/settings?success=false&message=An+unexpected+error+occured`,
        request.url,
      ),
    );
  }
}
