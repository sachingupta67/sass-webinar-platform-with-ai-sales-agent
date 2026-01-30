"use client";
import { User, Webinar } from "@/lib/generated/prisma/client";
import { WebinarWithPresenter } from "@/lib/types";
import {
  StreamVideo,
  StreamVideoClient,
  User as StreamUser,
} from "@stream-io/video-react-sdk";
import CustomLiveStreamPlayer from "./CustomLiveStreamPlayer";

type Props = {
  apiKey: string;
  token: string;
  callId: string;
  webinar: WebinarWithPresenter;
  user: User;
};

const hostUser: StreamUser = {
  id: process.env.NEXT_PUBLIC_STREAM_USER_ID || "",
};

const LiveStreamState = (props: Props) => {
  const { apiKey, token, callId, webinar, user } = props;
  const client = new StreamVideoClient({ apiKey, user: hostUser, token });
  return (
    <StreamVideo client={client}>
      <CustomLiveStreamPlayer
        username={user.name || ""}
        callId={callId}
        callType="livestream"
        webinar={webinar}
        token={token}
      />
    </StreamVideo>
  );
};

export default LiveStreamState;
