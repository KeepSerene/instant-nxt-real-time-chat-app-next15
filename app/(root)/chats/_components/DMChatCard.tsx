"use client";

import type { Id } from "@/convex/_generated/dataModel";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import FriendAvatar from "@/components/shared/FriendAvatar";
import { useChat } from "@/hooks/useChat";
import { cn } from "@/lib/utils";

interface DMChatCardProps {
  id: Id<"chats">;
  username: string;
  avatarUrl: string;
}

function DMChatCard({ id, username, avatarUrl }: DMChatCardProps) {
  const router = useRouter();
  const { isActive } = useChat();

  return (
    <Card
      tabIndex={0} // makes it keyboard focusable
      onClick={() => router.push(`/chats/${id}`)}
      className={cn(
        "w-full truncate p-2 cursor-pointer outline-2 outline-primary/50 outline-offset-2 focus-visible:outline flex flex-row items-center gap-4",
        isActive
          ? "bg-primary/20"
          : "hover:bg-primary/10 focus-within:bg-primary/10"
      )}
    >
      <div className="truncate flex items-center gap-4">
        <FriendAvatar avatarUrl={avatarUrl} username={username} />

        <section className="truncate flex flex-col">
          <h4 className="truncate">{username}</h4>
          <p className="text-muted-foreground text-sm truncate">
            Spark the conversation!
          </p>
        </section>
      </div>
    </Card>
  );
}

export default DMChatCard;
