"use server";

import { stripe } from "@/lib/stripe";
import { onAuthenticateUser } from "./auth";
import { prisma } from "@/lib/prismaClient";
import { subscriptionPriceId } from "@/lib/data";
import { Stripe } from "@stripe/stripe-js";

export const getAllProductsFromStripe = async () => {
  try {
    const currentUser = await onAuthenticateUser();
    if (!currentUser.user) {
      return {
        status: 401,
        message: "Unauthorized Access",
      };
    }

    if (!currentUser.user.stripeConnectId) {
      return {
        message: "User not connected to stripe",
        status: 401,
        success: false,
      };
    }
    const products = await stripe.products.list(
      {
        // active: true,
        // limit: 100,
        // expand: ["data.default_price"],
      },
      {
        stripeAccount: currentUser.user.stripeConnectId,
      },
    );
    return {
      products: products.data,
      status: 200,
      success: true,
    };
  } catch (err) {
    console.log("Failed to fetch stripe products::::", err);
    return {
      message: "Failed to fetch stripe products",
      success: false,
      status: 500,
    };
  }
};

export const onGetStripeClientSecret = async (
  email: string,
  userId: string,
) => {
  try {
    let customer;
    const existingCustomers = await stripe.customers.list({ email });
    if (existingCustomers.data.length) {
      customer = existingCustomers.data[0];
    } else {
      // Create a new customer if no one exists
      customer = await stripe.customers.create({
        email,
        metadata: {
          userId,
        },
      });
    }
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        stripeCustomerId: customer.id,
      },
    });

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: subscriptionPriceId }],
      payment_behavior: "default_incomplete",
      expand: ["latest_invoice.payment_intent"],
      metadata: {
        userId,
      },
    });

    const paymentIntent = subscription?.latest_invoice?.payment_intent ?? "";
    return {
      status: 200,
      secret: paymentIntent.client_secret ?? "",
      customerId: customer.id,
    };
  } catch (error) {
    console.error("Error::Stripe Connection Creation ::::::", error);
    return {
      status: 400,
      message: "Failed to create stripe connection",
    };
  }
};

//4:02:35
