"use client";

import type { Id } from "@/convex/_generated/dataModel";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import AvatarComponent from "@/components/shared/AvatarComponent";
import { useChat } from "@/hooks/useChat";
import { cn } from "@/lib/utils";

interface DMChatCardProps {
  id: Id<"chats">;
  username: string;
  avatarUrl: string;
  lastMsgSender?: string;
  lastMsgContent?: string;
}

function DMChatCard({
  id,
  username,
  avatarUrl,
  lastMsgSender,
  lastMsgContent,
}: DMChatCardProps) {
  const router = useRouter();
  const { isActive } = useChat();

  return (
    <Card
      tabIndex={0} // makes the card keyboard focusable
      onClick={() => router.push(`/chats/${id}`)}
      title={lastMsgContent && lastMsgContent}
      className={cn(
        "w-full truncate p-2 cursor-pointer outline-2 outline-primary/50 outline-offset-2 focus-visible:outline flex flex-row items-center gap-4",
        isActive
          ? "bg-primary/20"
          : "hover:bg-primary/10 focus-within:bg-primary/10"
      )}
    >
      <div className="truncate flex items-center gap-4">
        <AvatarComponent avatarUrl={avatarUrl} username={username} />

        <section className="truncate flex flex-col">
          <h4 className="truncate">{username}</h4>

          {lastMsgSender && lastMsgContent ? (
            <div className="text-muted-foreground text-sm truncate flex">
              <p className="font-semibold">{lastMsgSender}:&nbsp;</p>
              <p className="truncate">{lastMsgContent}</p>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm truncate">
              Spark the conversation!
            </p>
          )}
        </section>
      </div>
    </Card>
  );
}

export default DMChatCard;
