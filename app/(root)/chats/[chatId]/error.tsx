"use client";

import ChatFallback from "@/components/shared/chat/ChatFallback";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function ChatErrorPage({
  error,
}: {
  error: Error & { digest?: string };
}) {
  const router = useRouter();

  useEffect(() => {
    console.error("Chat page error:", error);
    toast.error("Chat not found", {
      description:
        "The chat you're looking for doesn't exist or has been deleted!",
      action: {
        label: "Go to Chats",
        onClick: () => router.push("/chats"),
      },
    });
    const timerId = setTimeout(() => {
      router.push("/chats");
    }, 3000);

    return () => clearTimeout(timerId);
  }, [error, router]);

  return <ChatFallback />;
}
