"use client";

import type { User, Webinar } from "@/lib/generated/prisma/client";
import { WebinarStatusEnum } from "@/lib/generated/prisma/enums";
import React, { useEffect } from "react";
import WebinarUpcomingState from "./UpcomingWebinar/WebinarUpcomingState";
import { usePathname, useRouter } from "next/navigation";
import { useAttendeeStore } from "@/store/useAttendeeStore";
import { toast } from "sonner";
import WaitlistComponent from "./UpcomingWebinar/WaitlistComponent";

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

  const renderWebinarStatus = () => {
    switch (webinar.webinarStatus) {
      case WebinarStatusEnum.SCHEDULED:
        return (
          <WebinarUpcomingState webinar={webinar} currentUser={user || null} />
        );
      case WebinarStatusEnum.WAITING_ROOM:
        return (
          <WebinarUpcomingState webinar={webinar} currentUser={user || null} />
        );
      case WebinarStatusEnum.LIVE:
        return (
          // TODO : Add Livestream component and webinar stuff
          <React.Fragment>
            {user?.id === webinar.presenterId ? (
              // <LiveStreamState apiKey={apiKey} token={token} callId={callId} />
              "Live Stream State for Presenter"
            ) : attendee ? (
              // <Participant apiKey={apiKey} token={token} callId={callId} />
              "Live Stream State for Participant"
            ) : (
              <WebinarUpcomingState
                webinar={webinar}
                currentUser={user || null}
              />
            )}
          </React.Fragment>
        );
      case WebinarStatusEnum.CANCELLED:
        return (
          <div className="flex justify-center items-center h-full w-full">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-semibold text-primary">
                {webinar?.title}
              </h3>
              <p className="text-muted-foreground text-xs">
                This webinar has been cancelled. Please check back later for
                more information.
              </p>
            </div>
          </div>
        );
      default:
        return (
          <WebinarUpcomingState webinar={webinar} currentUser={user || null} />
        );
    }
  };

  return <React.Fragment>{renderWebinarStatus()}</React.Fragment>;
};

export default RenderWebinar;
