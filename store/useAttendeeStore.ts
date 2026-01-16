import { Attendee } from "@/lib/generated/prisma/client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type AttendeeStore = {
  attendee: Attendee | null;
  setAttendee: (attendee: Attendee) => void;
  clearAttendance: () => void;
};

// create teh zustand with persistance
export const useAttendeeStore = create<AttendeeStore>()(
  persist(
    (set) => ({
      attendee: null,
      setAttendee: (attendee: Attendee) => set({ attendee }),
      clearAttendance: () => set({ attendee: null }),
    }),
    {
      name: "attendee-storage", // required for persist
    }
  )
);
