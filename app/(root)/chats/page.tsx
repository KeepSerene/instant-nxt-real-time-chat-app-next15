import type { Metadata } from "next";
import ActionItemList from "@/components/shared/action-item-list/ActionItemList";

export const metadata: Metadata = {
  title: "Your Chats",
};

type Props = {};

const ChatsPage = (props: Props) => {
  return (
    <>
      <ActionItemList title="Your chats">Chats page</ActionItemList>
    </>
  );
};

export default ChatsPage;
