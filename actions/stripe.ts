"use server";

import { stripe } from "@/lib/stripe";
import { onAuthenticateUser } from "./auth";

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
