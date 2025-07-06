import type { Metadata } from "next";
import { Id } from "@/convex/_generated/dataModel";
import ChatPageContent from "./_components/ChatPageContent";
import { getChatById } from "@/lib/convexClient";

// export const metadata: Metadata = {
//   title: "Conversation",
// };

export async function generateMetadata({
  params,
}: {
  params: { chatId: Id<"chats"> };
}): Promise<Metadata> {
  const { chatId } = await params;
  const chat = await getChatById(chatId);

  if (!chat) return { title: "Conversation Not Found" };

  const name = chat.isGroup
    ? chat.name
    : chat.otherMember?.username ?? "your friend";

  return { title: `Chat with ${name}` };
}

async function ChatPage({
  params,
}: {
  params: Promise<{ chatId: Id<"chats"> }>;
}) {
  const { chatId } = await params;

  return <ChatPageContent chatId={chatId} />;
}

export default ChatPage;
