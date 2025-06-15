import type { Metadata } from "next";
import { Id } from "@/convex/_generated/dataModel";
import ChatPageContent from "./_components/ChatPageContent";

export const metadata: Metadata = {
  title: "Chat",
};

async function ChatPage({
  params,
}: {
  params: Promise<{ chatId: Id<"chats"> }>;
}) {
  const { chatId } = await params;

  return <ChatPageContent chatId={chatId} />;
}

export default ChatPage;
