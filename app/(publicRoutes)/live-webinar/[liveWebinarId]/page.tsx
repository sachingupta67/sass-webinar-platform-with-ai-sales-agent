import { onAuthenticateUser } from "@/actions/auth";
import { getWebinarById } from "@/actions/webinar";
import React from "react";
import RenderWebinar from "./_components/RenderWebinar";
import { User } from "@/lib/generated/prisma/client";

type Props = {
  params: Promise<{
    liveWebinarId: string;
  }>;
  searchParams: Promise<{
    error: string;
  }>;
};
const Page = async (props: Props) => {
  const { liveWebinarId } = await props.params;
  const { error } = await props.searchParams;
  const webinarData = await getWebinarById(liveWebinarId);
  if (!webinarData) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center text-lg sm:text-4xl">
        Webinar not found
      </div>
    );
  }

  const checkUser = await onAuthenticateUser();

  // TODO : Create API KEys

  const apiKey = "process.env.STREAM_API_KEY" as string;
  const token = "process.env.STREAM_TOKEN" as string;
  const callId = "process.env.STREAM_CALL_ID" as string;

  return (
    <div className="w-full min-h-screen mx-auto">
      <RenderWebinar
        apiKey={apiKey}
        token={token}
        callId={callId}
        checkUser={checkUser.user || null}
        error={error}
        webinar={webinarData}
      />
    </div>
  );
};

export default Page;
