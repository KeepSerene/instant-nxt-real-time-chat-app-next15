"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import ActionItemList from "@/components/shared/action-item-list/ActionItemList";
import CreateGroupDialog from "./CreateGroupDialog";
import DMChatCard from "./DMChatCard";
import { LoaderIcon } from "lucide-react";
import GroupChatCard from "./GroupChatCard";

function ChatList() {
  const enrichedChats = useQuery(api.chats.get);

  return (
    <ActionItemList title="Your chats" actionItem={<CreateGroupDialog />}>
      {enrichedChats ? (
        enrichedChats.length === 0 ? (
          <p className="size-full text-muted-foreground text-sm text-center flex justify-center items-center">
            Your InstantNXT inbox is empty! 🚀
            <br />
            Send a 'hi' or invite a friend to start chatting.
          </p>
        ) : (
          enrichedChats.map((chatDetails) => {
            return chatDetails.chat.isGroup ? (
              <GroupChatCard
                key={chatDetails.chat._id}
                id={chatDetails.chat._id}
                name={chatDetails.chat.name ?? "Group Chat"}
                lastMsgSender={chatDetails.lastMsg?.senderName}
                lastMsgContent={chatDetails.lastMsg?.content}
              />
            ) : (
              <DMChatCard
                key={chatDetails.chat._id}
                id={chatDetails.chat._id}
                username={chatDetails.otherUser?.username ?? "User"}
                avatarUrl={chatDetails.otherUser?.avatarUrl ?? ""}
                lastMsgSender={chatDetails.lastMsg?.senderName}
                lastMsgContent={chatDetails.lastMsg?.content}
              />
            );
          })
        )
      ) : (
        <div className="size-full flex justify-center items-center">
          <LoaderIcon
            role="status"
            aria-live="polite"
            aria-label="Loading direct messages"
            className="size-8 text-muted-foreground animate-spin"
          />
        </div>
      )}
    </ActionItemList>
  );
}

export default ChatList;
