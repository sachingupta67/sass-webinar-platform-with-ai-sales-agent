import { onAuthenticateUser } from "@/actions/auth";
import { stripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prismaClient";
import { STRIPE_PRICE_IDS } from "@/lib/data";

export async function POST(request: NextRequest) {
  try {
    const userExist = await onAuthenticateUser();
    if (userExist.user) {
      const { priceId } = await request.json();
      if (!priceId || !Object.values(STRIPE_PRICE_IDS).includes(priceId)) {
        return NextResponse.json(
          { error: "Price id is required" },
          { status: 400 }
        );
      }

      const user = await prisma.user.findUnique({
        where: {
          id: userExist.user.id,
        },
      });

      if (!user) {
        return NextResponse.json(
          { error: "Unauthorized Access" },
          { status: 401 }
        );
      }

      let customerId = user.stripeCustomerId;

      if (!customerId) {
        // create stripe user
        const customer = await stripe.customers.create({
          email: user.email,
          metadata: {
            userId: user.id,
          },
        });

        customerId = customer.id;

        // update stripeCustomerId into existing user into db

        await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            stripeCustomerId: customer.id,
          },
        });
      }
      // create checkout session (with existing or new customer)
      const checkoutSession = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ["card"],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/home`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/home`,
        metadata: {
          userId: user.id,
        },
      });
      return NextResponse.json({ url: checkoutSession.url });
    }
    return NextResponse.json({ error: "Unauthorized Access" }, { status: 401 });
  } catch (err) {
    console.log("Error creating while checkout:::::", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
