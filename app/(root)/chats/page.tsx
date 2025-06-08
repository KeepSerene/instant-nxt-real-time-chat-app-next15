import type { Metadata } from "next";
import ChatList from "./_components/ChatList";

export const metadata: Metadata = {
  title: "Your Chats",
};

const ChatsPage = () => <ChatList />;

export default ChatsPage;
