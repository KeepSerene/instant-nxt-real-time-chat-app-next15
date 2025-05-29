import type { Metadata } from "next";
import ChatWrapper from "@/components/shared/chat/ChatWrapper";

export const metadata: Metadata = {
  title: "Chat",
};

async function ChatPage({ params }: { params: Promise<{ chatId: string }> }) {
  const { chatId } = await params;

  return <ChatWrapper>Chat ID: {chatId}</ChatWrapper>;
}

export default ChatPage;
