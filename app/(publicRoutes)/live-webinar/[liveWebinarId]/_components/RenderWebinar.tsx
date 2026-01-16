import { User, Webinar } from "@/lib/generated/prisma/client";
import React from "react";

type Props = {
  apiKey: string;
  token: string;
  callId: string;
  checkUser: User | null;
  error: string | undefined;
  webinar: Webinar;
};
const RenderWebinar = (props: Props) => {
  return <div>Render</div>;
};

export default RenderWebinar;
