"use client";

import type { Id } from "@/convex/_generated/dataModel";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import FriendAvatar from "@/components/shared/FriendAvatar";

interface DMChatCardProps {
  id: Id<"chats">;
  username: string;
  avatarUrl: string;
}

function DMChatCard({ id, username, avatarUrl }: DMChatCardProps) {
  const router = useRouter();

  return (
    <Card
      tabIndex={-1}
      onClick={() => router.push(`/chats/${id}`)}
      className="w-full truncate p-2 cursor-pointer flex flex-row items-center gap-4"
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
