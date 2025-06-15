"use client";

import ChatWrapper from "@/components/shared/chat/ChatWrapper";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { Loader } from "lucide-react";
import Header from "./Header";
import View from "./view/View";
import MessageBox from "./message-box/MessageBox";

function ChatPageContent({ chatId }: { chatId: Id<"chats"> }) {
  const chatRecordAndOtherMemberInfo = useQuery(api.chat.get, { id: chatId });

  if (chatRecordAndOtherMemberInfo === undefined) {
    <div className="size-full flex justify-center items-center">
      <Loader className="size-8" />
    </div>;
  } else if (chatRecordAndOtherMemberInfo === null) {
    <p className="size-full flex justify-center items-center">
      Oops! No such chat exists...🥺
    </p>;
  }

  return (
    <ChatWrapper>
      <Header
        name={
          (chatRecordAndOtherMemberInfo?.isGroup
            ? chatRecordAndOtherMemberInfo.name
            : chatRecordAndOtherMemberInfo?.otherMember?.username) ??
          "Happy bantering!"
        }
        avatarUrl={
          chatRecordAndOtherMemberInfo?.isGroup
            ? undefined
            : chatRecordAndOtherMemberInfo?.otherMember?.avatarUrl
        }
      />
      <View />
      <MessageBox />
    </ChatWrapper>
  );
}

export default ChatPageContent;
