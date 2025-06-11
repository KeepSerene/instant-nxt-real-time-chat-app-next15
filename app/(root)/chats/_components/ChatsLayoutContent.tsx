"use client";

import ChatFallback from "@/components/shared/chat/ChatFallback";
import { useChat } from "@/hooks/useChat";

function ChatsLayoutContent({ children }: { children: React.ReactNode }) {
  const { isActive } = useChat();

  return <>{isActive ? children : <ChatFallback />}</>;
}

export default ChatsLayoutContent;
