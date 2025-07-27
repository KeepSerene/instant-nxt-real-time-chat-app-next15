import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn, getUsernameInitials } from "@/lib/utils";
import { User2Icon } from "lucide-react";

interface FriendAvatarProps {
  avatarUrl?: string;
  username: string;
  className?: string;
}

function FriendAvatar({ avatarUrl, username, className }: FriendAvatarProps) {
  return (
    <Avatar className={cn(className && className)}>
      {avatarUrl && <AvatarImage src={avatarUrl} />}

      <AvatarFallback>
        {getUsernameInitials(username) ? (
          getUsernameInitials(username)
        ) : (
          <User2Icon />
        )}
      </AvatarFallback>
    </Avatar>
  );
}

export default FriendAvatar;
