import {
  WebinarAdditionalInfo,
  WebinarBasicInfo,
  WebinarCTA,
} from "@/store/useWebinarStore";
import { Attendee } from "./generated/prisma/client";

export type ValidationErrors = Record<string, string>;

export type ValidationResult = {
  valid: boolean;
  errors: ValidationErrors;
};
export const validateBasicInfo = (data: WebinarBasicInfo): ValidationResult => {
  const errors: ValidationErrors = {};
  if (!data.webinarName?.trim()) {
    errors.webinarName = "Webinar name is required";
  }

  if (!data.description?.trim()) {
    errors.description = "Description is required";
  }

  if (!data.date) {
    errors.date = "Date is required";
  }

  if (!data.time?.trim()) {
    errors.time = "Time is required";
  } else {
    // validate time format (HH:MM)
    const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9]$/;

    if (!timeRegex.test(data.time)) {
      errors.time = "Time must be format HH:MM (eg., 10:30)";
    }
  }
  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateCTA = (data: WebinarCTA): ValidationResult => {
  const errors: ValidationErrors = {};

  if (!data.ctaLabel?.trim()) {
    errors.ctaLabel = "CTA label is required";
  }

  if (!data.ctaType) {
    errors.ctaType = "Please select a CTA type";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateAdditionalInfo = (
  data: WebinarAdditionalInfo,
): ValidationResult => {
  const errors: ValidationErrors = {};

  // if coupon is enabled , code is required

  if (data.couponEnabled && !data.couponCode?.trim()) {
    errors.couponCode = "Coupon code is required";
  }
  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

export type AttendanceData = {
  count: number;
  users: Attendee[];
  webinarTags?: string[];
};
