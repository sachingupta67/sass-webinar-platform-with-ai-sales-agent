"use server";

import { WebinarFormState } from "@/store/useWebinarStore";
import { onAuthenticateUser } from "./auth";
import { prisma } from "@/lib/prismaClient";
import { revalidatePath } from "next/cache";
import { AttendedTypeEnum, CtaTypeEnum } from "@/lib/generated/prisma/enums";
import { AttendanceData } from "@/lib/types";

function combineDateTime(
  date: Date,
  timeStr: string,
  timeFormat: "AM" | "PM",
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
      formData.basicInfo.timeFormat || "AM",
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

export const getWebinarsByPresentedId = async (presenterId: string) => {
  try {
    const webinars = await prisma.webinar.findMany({
      where: { presenterId },
      include: {
        presenter: {
          select: {
            name: true,
            email: true,
            stripeConnectId: true,

            id: true,
          },
        },
      },
    });
    return webinars;
  } catch (error) {
    console.error("Failed to fetch webinars", error);
    return {
      status: 500,
      message: "Failed to fetch webinars. Please try again.",
    };
  }
};

export const getWebinarAttendance = async (
  webinarId: string,
  options: { includeUsers?: boolean; userLimit?: number } = {
    includeUsers: false,
    userLimit: 100,
  },
) => {
  const { includeUsers, userLimit } = options;
  try {
    const webinar = await prisma.webinar.findUnique({
      where: { id: webinarId },
      select: {
        id: true,
        ctaType: true,
        tags: true,
        _count: {
          select: {
            attendances: true,
          },
        },
      },
    });
    if (!webinar) {
      return {
        success: false,
        status: 404,
        message: "Webinar not found",
      };
    }

    const attendanceCount = await prisma.attendance.groupBy({
      by: ["attendedType"],
      where: {
        webinarId,
      },
      _count: {
        attendedType: true,
      },
    });
    const result: Record<AttendedTypeEnum, AttendanceData> = {} as Record<
      AttendedTypeEnum,
      AttendanceData
    >;

    for (const type of Object.values(AttendedTypeEnum)) {
      if (
        type === AttendedTypeEnum.ADD_TO_CART &&
        webinar.ctaType === CtaTypeEnum.BOOK_A_CALL
      ) {
        continue;
      }

      if (
        type === AttendedTypeEnum.BREAKOUT_ROOM &&
        webinar.ctaType !== CtaTypeEnum.BOOK_A_CALL
      ) {
        continue;
      }

      const countItem = attendanceCount.find((item) => {
        if (
          webinar.ctaType === CtaTypeEnum.BOOK_A_CALL &&
          type === AttendedTypeEnum.BREAKOUT_ROOM &&
          item.attendedType === AttendedTypeEnum.ADD_TO_CART
        ) {
          return true;
        }
        return Boolean(item.attendedType) === true; // TODO : needed to check later on
      });
      result[type] = {
        count: countItem ? countItem._count.attendedType : 0,
        users: [],
      };
    }

    if (options.includeUsers) {
      for (const type of Object.values(AttendedTypeEnum)) {
        if (
          (type === AttendedTypeEnum.ADD_TO_CART &&
            webinar.ctaType === CtaTypeEnum.BOOK_A_CALL) ||
          (type === AttendedTypeEnum.BREAKOUT_ROOM &&
            webinar.ctaType !== CtaTypeEnum.BOOK_A_CALL)
        ) {
          continue;
        }
        const queryType =
          webinar.ctaType === CtaTypeEnum.BOOK_A_CALL &&
          type === AttendedTypeEnum.BREAKOUT_ROOM
            ? AttendedTypeEnum.ADD_TO_CART
            : type;

        if (result[type].count > 0) {
          const attendances = await prisma.attendance.findMany({
            where: {
              webinarId,
              attendedType: queryType,
            },
            include: {
              user: true,
            },
            take: userLimit, // limit the number of users returned
            orderBy: {
              joinedAt: "desc", // most recent first
            },
          });
          result[type].users = attendances.map((attendance) => {
            return {
              id: attendance.user.id,
              name: attendance.user.name,
              email: attendance.user.email,
              attendedAt: attendance.joinedAt,
              stripeConnectedId: null,
              callStatus: attendance.user.callStatus,
            };
          });
        }
      }
    }
    // revalidatePath(`/webinars/${webinarId}/pipelines`); // TODO: causing issue
    return {
      status: 200,
      data: result,
      ctaType: webinar.ctaType,
      webinarTags: webinar.tags,
    };
  } catch (error) {
    console.error("Failed to fetch webinar attendance type", error);
    return {
      status: 500,
      message: "Failed to fetch webinars. Please try again.",
    };
  }
};
