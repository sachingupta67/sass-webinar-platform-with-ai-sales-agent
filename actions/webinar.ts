"use server";

import { WebinarFormState } from "@/store/useWebinarStore";
import { onAuthenticateUser } from "./auth";
import { prisma } from "@/lib/prismaClient";
import { revalidatePath } from "next/cache";

function combineDateTime(
  date: Date,
  timeStr: string,
  timeFormat: "AM" | "PM"
): Date {
  const [hoursStr, minutesStr] = timeStr.split(":");
  let hours = Number.parseInt(hoursStr, 10);
  const minutes = Number.parseInt(minutesStr, 10);

  // convert to 24 hour format
  if (timeFormat === "PM" && hours < 12) {
    hours += 12;
  } else if (timeFormat === "AM" && hours === 12) {
    hours = 0;
  }

  const result = new Date(date);
  result.setHours(hours, minutes, 0, 0);
  return result;
}
export const createWebinar = async (formData: WebinarFormState) => {
  try {
    const user = await onAuthenticateUser();
    if (!user) {
      return { status: 401, message: "Unauthorized user" };
    }

    // TODO : check if user has a subscription
    // if (!user.user?.subscription) {
    //   return { status: 402, message: "Subscription required" };
    // }

    const presenterId = user.user?.id;
    console.log("form data", formData, presenterId);

    if (!formData.basicInfo.webinarName) {
      return { status: 404, message: "Webinar name is required" };
    }
    if (!formData.basicInfo.date) {
      return { status: 404, message: "Date is required" };
    }
    if (!formData.basicInfo.time) {
      return { status: 404, message: "Time is required" };
    }
    const combinedDateTime = combineDateTime(
      formData.basicInfo.date,
      formData.basicInfo.time,
      formData.basicInfo.timeFormat || "AM"
    );

    const now = new Date();

    if (combinedDateTime < now) {
      return {
        status: 400,
        message: "Webinar date and time cannot be in the past",
      };
    }

    const webinar = await prisma?.webinar.create({
      data: {
        title: formData.basicInfo.webinarName,
        description: formData.basicInfo.description,
        startTime: combinedDateTime,
        tags: formData.cta.tags,
        ctaLabel: formData.cta.ctaLabel,
        ctaType: formData.cta.ctaType,
        aiAgentId: formData.cta.aiAgent || null,
        priceId: formData.cta.priceId || null,
        lockChat: formData.additionalInfo.lockChat || false,
        couponCode: formData.additionalInfo.couponEnabled
          ? formData.additionalInfo.couponCode
          : null,
        couponEnabled: formData.additionalInfo.couponEnabled || false,
        presenterId: presenterId as string,
      },
    });

    revalidatePath("/");
    return {
      status: 200,
      message: "Webinar created successfully",
      webinarId: webinar.id,
      webinarLink: `/webinar/${webinar.id}`,
    };
  } catch (error) {
    console.error("Error creating webinar", error);
    return {
      status: 500,
      message: "Failed to create webinar. Please try again.",
    };
  }
};

// 2:06:50
