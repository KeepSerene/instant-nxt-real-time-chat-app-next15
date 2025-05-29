import type { Metadata } from "next";
import ActionItemList from "@/components/shared/action-item-list/ActionItemList";
import AddFriendDialog from "./_components/AddFriendDialog";
import ChatFallback from "@/components/shared/chat/ChatFallback";

export const metadata: Metadata = {
  title: "Your Friends",
};

function FriendsPage() {
  return (
    <>
      <ActionItemList title="Your friends" actionItem={<AddFriendDialog />}>
        FriendsPage
      </ActionItemList>

      <ChatFallback />
    </>
  );
}

export default FriendsPage;
