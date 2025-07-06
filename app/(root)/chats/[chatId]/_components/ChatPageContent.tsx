"use client";

import { useState } from "react";
import ChatWrapper from "@/components/shared/chat/ChatWrapper";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { Loader } from "lucide-react";
import Header from "./Header";
import View from "./view/View";
import MessageBox from "./message-box/MessageBox";
import RemoveFriendDialog from "./dialogs/RemoveFriendDialog";

function ChatPageContent({ chatId }: { chatId: Id<"chats"> }) {
  const [isRemoveFrndModalOpen, setIsRemoveFrndModalOpen] = useState(false);
  const [isDeleteGroupModalOpen, setIsDeleteGroupModalOpen] = useState(false);
  const [isLeaveGroupModalOpen, setIsLeaveGroupModalOpen] = useState(false);
  const [callType, setCallType] = useState<"audio" | "video" | null>(null);

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
        options={
          chatRecordAndOtherMemberInfo?.isGroup
            ? [
                {
                  label: "Leave Group",
                  isDestructive: false,
                  onClickHandler: () => setIsLeaveGroupModalOpen(true),
                },
                {
                  label: "Delete Group",
                  isDestructive: true,
                  onClickHandler: () => setIsDeleteGroupModalOpen(true),
                },
              ]
            : [
                {
                  label: "Remove Friend",
                  isDestructive: true,
                  onClickHandler: () => setIsRemoveFrndModalOpen(true),
                },
              ]
        }
      />
      <View />
      <MessageBox />
      <RemoveFriendDialog
        chatId={chatId}
        isOpen={isRemoveFrndModalOpen}
        setIsOpen={setIsRemoveFrndModalOpen}
      />
    </ChatWrapper>
  );
}

export default ChatPageContent;
