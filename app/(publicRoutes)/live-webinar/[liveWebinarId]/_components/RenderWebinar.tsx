import {
  User,
  Webinar,
  WebinarStatusEnum,
} from "@/lib/generated/prisma/client";
import React from "react";
import WebinarUpcomingState from "./UpcomingWebinar/WebinarUpcomingState";

type Props = {
  apiKey: string;
  token: string;
  callId: string;
  user: User | null;
  error: string | undefined;
  webinar: Webinar;
};
const RenderWebinar = (props: Props) => {
  const { apiKey, token, callId, user, webinar, error } = props;
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
