"use client";

import type { User, Webinar } from "@/lib/generated/prisma/client";
import { WebinarStatusEnum } from "@/lib/generated/prisma/enums";
import React, { useEffect } from "react";
import WebinarUpcomingState from "./UpcomingWebinar/WebinarUpcomingState";
import { usePathname, useRouter } from "next/navigation";
import { useAttendeeStore } from "@/store/useAttendeeStore";
import { toast } from "sonner";

type Props = {
  apiKey: string;
  token: string;
  callId: string;
  user: User | null;
  error: string | undefined;
  webinar: Webinar;
};
const RenderWebinar = (props: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const { attendee } = useAttendeeStore();
  const { apiKey, token, callId, user, webinar, error } = props;

  useEffect(() => {
    if (error) {
      toast.error(error);
      router.push(pathname);
    }
  }, [error]);
  // TODO : build waiting room and live webinar
  return (
    <React.Fragment>
      {webinar.webinarStatus === WebinarStatusEnum.SCHEDULED ? (
        <WebinarUpcomingState webinar={webinar} currentUser={user || null} />
      ) : (
        ""
      )}
    </React.Fragment>
  );
};

export default RenderWebinar;
