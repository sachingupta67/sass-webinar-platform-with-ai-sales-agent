import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prismaClient";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("❌ Stripe signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      /* -------------------------------- CHECKOUT COMPLETED ------------------------------- */
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        if (!session.subscription || !session.metadata?.userId) break;

        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );

        const item = subscription.items.data[0];
        if (!item) break;

        await prisma.user.update({
          where: { id: session.metadata.userId },
          data: {
            stripeCustomerId: subscription.customer as string,
            stripeSubscriptionId: subscription.id,
            stripePriceId: item.price.id,
            subscription: subscription.status === "active",
            stripeCurrentPeriodEnd: new Date(
              subscription.items.data[0].current_period_end * 1000
            ),
          },
        });

        break;
      }

      /* --------------------------- SUBSCRIPTION UPDATED --------------------------- */
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;

        const item = subscription.items.data[0];
        if (!item) break;

        await prisma.user.updateMany({
          where: {
            stripeCustomerId: subscription.customer as string,
          },
          data: {
            stripeSubscriptionId: subscription.id,
            stripePriceId: item.price.id,
            subscription: subscription.status === "active",
            stripeCurrentPeriodEnd: new Date(
              subscription.items.data[0].current_period_end * 1000
            ),
          },
        });

        break;
      }

      /* --------------------------- SUBSCRIPTION DELETED --------------------------- */
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        await prisma.user.updateMany({
          where: {
            stripeCustomerId: subscription.customer as string,
          },
          data: {
            subscription: false,
            stripeSubscriptionId: null,
            stripePriceId: null,
            stripeCurrentPeriodEnd: null,
          },
        });

        break;
      }

      default:
        console.log(`⚠️ Unhandled event: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("❌ Webhook handler error", err);

    // IMPORTANT: Always return 200 so Stripe doesn’t retry endlessly
    return NextResponse.json({ received: true });
  }
}
