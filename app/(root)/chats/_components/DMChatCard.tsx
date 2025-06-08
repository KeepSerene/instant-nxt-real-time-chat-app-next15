import type { Id } from "@/convex/_generated/dataModel";

interface DMChatCardProps {
  id: Id<"chats">;
  username: string;
  avatarUrl: string;
}

function DMChatCard({ id, username, avatarUrl }: DMChatCardProps) {
  return <div>DMChatCard</div>;
}

export default DMChatCard;
