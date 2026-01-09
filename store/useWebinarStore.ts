import { CtaTypeEnum } from "@/lib/generated/prisma/enums";
import {
  validateAdditionalInfo,
  validateBasicInfo,
  validateCTA,
  ValidationErrors,
} from "@/lib/types";
import { create } from "zustand";

export type WebinarBasicInfo = {
  webinarName?: string;
  description?: string;
  date?: Date;
  time?: string;
  timeFormat?: "AM" | "PM";
};

export type WebinarCTA = {
  ctaLabel?: string;
  tags?: string[];
  ctaType: CtaTypeEnum;
  aiAgent?: string;
  priceId?: string;
};

export type WebinarAdditionalInfo = {
  lockChat?: boolean;
  couponCode?: string;
  couponEnabled?: boolean;
};

export type WebinarFormState = {
  basicInfo: WebinarBasicInfo;
  cta: WebinarCTA;
  additionalInfo: WebinarAdditionalInfo;
};

type ValidationState = {
  basicInfo: {
    valid: boolean;
    errors: ValidationErrors;
  };
  cta: {
    valid: boolean;
    errors: ValidationErrors;
  };
  additionalInfo: {
    valid: boolean;
    errors: ValidationErrors;
  };
};
const initialState: WebinarFormState = {
  basicInfo: {
    webinarName: "",
    description: "",
    date: undefined,
    time: "",
    timeFormat: "AM",
  },
  cta: {
    ctaLabel: "",
    tags: [],
    ctaType: CtaTypeEnum.BUY_NOW,
    aiAgent: "",
    priceId: "",
  },
  additionalInfo: {
    lockChat: false,
    couponCode: "",
    couponEnabled: false,
  },
};

const initialValidation: ValidationState = {
  basicInfo: {
    valid: false,
    errors: {},
  },
  cta: {
    valid: false,
    errors: {},
  },
  additionalInfo: {
    valid: true, // optional by default this one
    errors: {},
  },
};

type WebinarStore = {
  isModalOpen: boolean;
  isComplete: boolean;
  isSubmitting: boolean;
  formData: WebinarFormState;
  validation: ValidationState;

  setModalOpen: (open: boolean) => void;
  setComplete: (complete: boolean) => void;
  setSubmitting: (submitting: boolean) => void;

  updateBasicInfoField: <K extends keyof WebinarFormState["basicInfo"]>(
    field: K,
    value: WebinarFormState["basicInfo"][K]
  ) => void;

  updateCtaField: <K extends keyof WebinarFormState["cta"]>(
    field: K,
    value: WebinarFormState["cta"][K]
  ) => void;

  updateAdditionalInfo: <K extends keyof WebinarFormState["additionalInfo"]>(
    field: K,
    value: WebinarFormState["additionalInfo"][K]
  ) => void;

  validateStep: (stepId: keyof WebinarFormState) => boolean;

  getValidationErrors: (stepId: keyof WebinarFormState) => ValidationErrors;

  resetForm: () => void;
};

export const useWebinarStore = create<WebinarStore>((set, get) => {
  return {
    isModalOpen: false,
    isComplete: false,
    isSubmitting: false,
    formData: initialState,
    validation: initialValidation,

    setModalOpen: (open) => set({ isModalOpen: open }),
    setComplete: (complete) => set({ isComplete: complete }),
    setSubmitting: (submitting) => set({ isSubmitting: submitting }),

    updateBasicInfoField: (field, value) => {
      return set((state) => {
        const newBasicInfo = { ...state.formData.basicInfo, [field]: value };
        const validationResult = validateBasicInfo(newBasicInfo);
        return {
          formData: { ...state.formData, basicInfo: newBasicInfo },
          validation: { ...state.validation, basicInfo: validationResult },
        };
      });
    },
    updateCtaField: (field, value) => {
      return set((state) => {
        const newCta = { ...state.formData.cta, [field]: value };
        const validationResult = validateCTA(newCta);
        return {
          formData: { ...state.formData, cta: newCta },
          validation: { ...state.validation, cta: validationResult },
        };
      });
    },
    updateAdditionalInfo: (field, value) => {
      return set((state) => {
        const newAdditionalInfo = {
          ...state.formData.additionalInfo,
          [field]: value,
        };
        const validateResult = validateAdditionalInfo(newAdditionalInfo);
        return {
          formData: { ...state.formData, additionalInfo: newAdditionalInfo },
          validation: {
            ...state.validation,
            additionalInfo: validateResult,
          },
        };
      });
    },

    validateStep: (stepId: keyof WebinarFormState) => {
      const { formData } = get();
      let validationResults: { valid: boolean; errors: ValidationErrors } = {
        valid: false,
        errors: {},
      };
      switch (stepId) {
        case "basicInfo":
          validationResults = validateBasicInfo(formData.basicInfo);
          break;
        case "cta":
          validationResults = validateCTA(formData.cta);
          break;
        case "additionalInfo":
          validationResults = validateAdditionalInfo(formData.additionalInfo);
          break;
      }

      set((state) => {
        return {
          validation: { ...state.validation, [stepId]: validationResults },
        };
      });
      return validationResults.valid;
    },

    getValidationErrors: (stepId: keyof WebinarFormState) => {
      return get().validation[stepId].errors;
    },
    resetForm: () =>
      set({
        isComplete: false,
        isModalOpen: false,
        isSubmitting: false,
        formData: initialState,
        validation: initialValidation,
      }),
  };
});

// 1:25:12
