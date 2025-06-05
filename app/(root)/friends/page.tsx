import type { Metadata } from "next";
import ActionItemList from "@/components/shared/action-item-list/ActionItemList";
import AddFriendDialog from "./_components/AddFriendDialog";
import FriendRequestList from "./_components/FriendRequestList";

export const metadata: Metadata = {
  title: "Your Friends",
};

function FriendsPage() {
  return (
    <ActionItemList title="Your friends" actionItem={<AddFriendDialog />}>
      <FriendRequestList />
    </ActionItemList>
  );
}

export default FriendsPage;
