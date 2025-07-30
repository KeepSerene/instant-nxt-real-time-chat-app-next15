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
import DeleteGroupDialog from "./dialogs/DeleteGroupDialog";
import LeaveGroupDialog from "./dialogs/LeaveGroupDialog";

function ChatPageContent({ chatId }: { chatId: Id<"chats"> }) {
  const [isRemoveFrndModalOpen, setIsRemoveFrndModalOpen] = useState(false);
  const [isDeleteGroupModalOpen, setIsDeleteGroupModalOpen] = useState(false);
  const [isLeaveGroupModalOpen, setIsLeaveGroupModalOpen] = useState(false);

  const chatRecordAndOtherMemberInfo = useQuery(api.chat.get, { id: chatId });

  if (chatRecordAndOtherMemberInfo === undefined) {
    return (
      <div className="size-full bg-muted text-muted-foreground flex justify-center items-center">
        <Loader className="size-8 animate-spin" />
      </div>
    );
  }

  if (chatRecordAndOtherMemberInfo === null) {
    return (
      <p className="size-full bg-muted text-muted-foreground flex justify-center items-center">
        Oops! No such chat exists...🥺
      </p>
    );
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
      <View
        chatMembers={
          chatRecordAndOtherMemberInfo?.isGroup
            ? chatRecordAndOtherMemberInfo.otherMembers || []
            : chatRecordAndOtherMemberInfo?.otherMember
            ? [chatRecordAndOtherMemberInfo.otherMember]
            : []
        }
      />
      <MessageBox />
      <RemoveFriendDialog
        chatId={chatId}
        isOpen={isRemoveFrndModalOpen}
        setIsOpen={setIsRemoveFrndModalOpen}
      />
      <DeleteGroupDialog
        chatId={chatId}
        isOpen={isDeleteGroupModalOpen}
        setIsOpen={setIsDeleteGroupModalOpen}
      />
      <LeaveGroupDialog
        chatId={chatId}
        isOpen={isLeaveGroupModalOpen}
        setIsOpen={setIsLeaveGroupModalOpen}
      />
    </ChatWrapper>
  );
}

export default ChatPageContent;
