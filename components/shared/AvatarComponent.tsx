import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn, getUsernameInitials } from "@/lib/utils";
import { User2Icon } from "lucide-react";

interface AvatarComponentProps {
  avatarUrl?: string;
  username: string;
  className?: string;
}

function AvatarComponent({
  avatarUrl,
  username,
  className,
}: AvatarComponentProps) {
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

export default AvatarComponent;
