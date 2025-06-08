"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import FriendRequestCard from "./FriendRequestCard";
import { LoaderIcon } from "lucide-react";

function FriendRequestList() {
  const incomingRequests = useQuery(api.requests.get);

  return (
    <>
      {incomingRequests ? (
        incomingRequests.length === 0 ? (
          <p className="size-full text-muted-foreground text-sm text-center flex justify-center items-center">
            Your InstantNXT network is empty! 🚀
            <br />
            Send a request or invite a friend to start chatting.
          </p>
        ) : (
          incomingRequests?.map((incomingRequest) => (
            <FriendRequestCard
              key={incomingRequest.request._id}
              id={incomingRequest.request._id}
              username={incomingRequest.senderUser.username}
              avatarUrl={incomingRequest.senderUser.avatarUrl}
              email={incomingRequest.senderUser.email}
            />
          ))
        )
      ) : (
        <div className="size-full flex justify-center items-center">
          <LoaderIcon
            role="status"
            aria-live="polite"
            aria-label="Loading friend requests"
            className="size-8 text-muted-foreground animate-spin"
          />
        </div>
      )}
    </>
  );
}

export default FriendRequestList;
