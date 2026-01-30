"use client";

import { WebinarWithPresenter } from "@/lib/types";
import {
  Call,
  StreamCall,
  useStreamVideoClient,
} from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";
import LiveWebinarView from "../Common/LiveWebinarView";

type Props = {
  username: string;
  callId: string;
  callType: string;
  webinar: WebinarWithPresenter;
  token: string;
};

const CustomLiveStreamPlayer = (props: Props) => {
  const { callId, callType, webinar, token, username } = props;
  const client = useStreamVideoClient();
  const [call, setCall] = useState<Call>();
  const [showChat, setShowChat] = useState(true);

  useEffect(() => {
    if (!client) {
      return;
    }
    const myCall = client.call(callType, callId);
    setCall(myCall);

    myCall.join().catch((e) => {
      console.error("Failed to join call", e);
    });

    return () => {
      myCall.leave().catch((e) => {
        console.error("Failed to leave call", e);
      });

      setCall(undefined);
    };
  }, [client, callId, callType]);

  if (!call) {
    return null;
  }
  return (
    <StreamCall call={call}>
      <LiveWebinarView
        showChat={showChat}
        setShowChat={setShowChat}
        isHost={true} // true for live stream player
        username={username}
        userId={process.env.NEXT_PUBLIC_STREAM_USER_ID as string}
        userToken={token}
        webinar={webinar}
      />
    </StreamCall>
  );
};

export default CustomLiveStreamPlayer;
