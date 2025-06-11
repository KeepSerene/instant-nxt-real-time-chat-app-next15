import type { Metadata } from "next";
import ActionItemList from "@/components/shared/action-item-list/ActionItemList";
import AddFriendDialog from "./_components/AddFriendDialog";
import FriendRequestList from "./_components/FriendRequestList";
import ChatFallback from "@/components/shared/chat/ChatFallback";

export const metadata: Metadata = {
  title: "Your Friends",
};

function FriendsPage() {
  return (
    <div className="size-full flex gap-4">
      <ActionItemList title="Your friends" actionItem={<AddFriendDialog />}>
        <FriendRequestList />
      </ActionItemList>

      <ChatFallback />
    </div>
  );
}

export default FriendsPage;
