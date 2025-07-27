"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useChat } from "@/hooks/useChat";
import { useQuery } from "convex/react";
import Message from "./Message";
import { usePendingMutation } from "@/hooks/usePendingMutation";
import { useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ViewProps {
  chatMembers: {
    username?: string;
    lastSeenMessageId?: Id<"messages">;
    [key: string]: any;
  }[];
}

function View({ chatMembers }: ViewProps) {
  const { chatId } = useChat();
  const chatMessagesWithUsers = useQuery(api.messages.get, {
    chatId: chatId as Id<"chats">,
  });
  const { mutate: markRead } = usePendingMutation(api.chat.markRead);

  useEffect(() => {
    if (chatMessagesWithUsers && chatMessagesWithUsers.length > 0) {
      markRead({
        chatId,
        messageId: chatMessagesWithUsers[0].msg._id, // latest msg ID
      });
    }
  }, [chatId, chatMessagesWithUsers, markRead]);

  const renderReadByLabel = (names: string[]) => {
    switch (names.length) {
      case 1:
        return (
          <p className="text-muted-foreground text-xs">Read by {names[0]}</p>
        );
      case 2:
        return (
          <p className="text-muted-foreground text-xs">
            Read by {names[0]} and {names[1]}
          </p>
        );
      default:
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <span className="text-muted-foreground text-xs">
                  Read by {names[0]}, {names[1]}, and {names.length - 2} more
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <ul>
                  {names.map((name, idx) => (
                    <li key={idx}>{name}</li>
                  ))}
                </ul>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
    }
  };

  const getReadReceipt = (msgId: Id<"messages">) => {
    // Find the current message to get its creation time
    const currentMessage = chatMessagesWithUsers?.find(
      ({ msg }) => msg._id === msgId
    );

    if (!currentMessage) return undefined;

    const readerFirstNames = chatMembers
      .filter((member) => {
        // If user hasn't seen any messages yet
        if (!member.lastSeenMessageId) return false;

        // Find the last seen message to get its creation time
        const lastSeenMessage = chatMessagesWithUsers?.find(
          ({ msg }) => msg._id === member.lastSeenMessageId
        );

        if (!lastSeenMessage) return false;

        // Message is read if the last seen message was created after or at the same time as current message
        const isRead =
          lastSeenMessage.msg._creationTime >= currentMessage.msg._creationTime;

        return isRead;
      })
      .map((user) => user.username?.split(" ")[0])
      .filter((name): name is string => Boolean(name)); // filter out undefined

    if (readerFirstNames.length === 0) return undefined;

    return renderReadByLabel(readerFirstNames);
  };

  return (
    <div className="flex-1 w-full p-3 overflow-y-auto flex flex-col-reverse gap-2">
      {chatMessagesWithUsers?.map(
        ({ msg, senderAvatar, senderName, isCurrentUser }, index) => {
          const isLastMsgByUser =
            chatMessagesWithUsers[index - 1]?.msg.senderId ===
            chatMessagesWithUsers[index].msg.senderId;
          const receipt = isCurrentUser ? getReadReceipt(msg._id) : undefined;

          return (
            <Message
              key={msg._id}
              isFromCurrentUser={isCurrentUser}
              sendAvatar={senderAvatar}
              senderName={senderName}
              content={msg.content}
              isLastMsgByUser={isLastMsgByUser}
              createdAt={msg._creationTime}
              type={msg.type}
              readReceipt={receipt}
            />
          );
        }
      )}
    </div>
  );
}

export default View;
