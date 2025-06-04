"use client";

// import type { Metadata } from "next";
import { api } from "@/convex/_generated/api";
import ActionItemList from "@/components/shared/action-item-list/ActionItemList";
import AddFriendDialog from "./_components/AddFriendDialog";
import ChatFallback from "@/components/shared/chat/ChatFallback";
import { useQuery } from "convex/react";
import { LoaderIcon } from "lucide-react";
import FriendRequestCard from "./_components/FriendRequestCard";

// export const metadata: Metadata = {
//   title: "Your Friends",
// };

function FriendsPage() {
  const incomingRequests = useQuery(api.requests.get);

  return (
    <>
      <ActionItemList title="Your friends" actionItem={<AddFriendDialog />}>
        {incomingRequests ? (
          incomingRequests.length === 0 ? (
            <p className="size-full text-muted-foreground text-sm text-center flex justify-center items-center">
              Your InstantNXT inbox is empty! 🚀
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
      </ActionItemList>

      <ChatFallback />
    </>
  );
}

export default FriendsPage;
