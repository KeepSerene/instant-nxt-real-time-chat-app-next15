"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useChat } from "@/hooks/useChat";
import { useQuery } from "convex/react";
import Message from "./Message";

function View() {
  const { chatId } = useChat();
  const chatMessagesWithUsers = useQuery(api.messages.get, {
    chatId: chatId as Id<"chats">,
  });

  return (
    <div className="flex-1 w-full p-3 overflow-y-auto flex flex-col-reverse gap-2">
      {chatMessagesWithUsers?.map(
        ({ msg, senderAvatar, senderName, isCurrentUser }, index) => {
          const isLastMsgByUser =
            chatMessagesWithUsers[index - 1]?.msg.senderId ===
            chatMessagesWithUsers[index].msg.senderId;

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
            />
          );
        }
      )}
    </div>
  );
}

export default View;
