import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getUsernameInitials } from "@/lib/utils";
import { User2Icon } from "lucide-react";

interface FriendAvatarProps {
  avatarUrl: string;
  username: string;
}

function FriendAvatar({ avatarUrl, username }: FriendAvatarProps) {
  return (
    <Avatar>
      <AvatarImage src={avatarUrl} />

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
