import ChatFallback from "@/components/shared/chat/ChatFallback";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Chats",
};

type Props = {};

const ChatsPage = (props: Props) => {
  return <ChatFallback />;
};

export default ChatsPage;
