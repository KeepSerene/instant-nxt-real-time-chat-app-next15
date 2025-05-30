import type { Id } from "@/convex/_generated/dataModel";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUsernameInitials } from "@/lib/utils";
import { CheckCircleIcon, User2Icon, XCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type FriendRequestCardProps = {
  id: Id<"requests">;
  username: string;
  avatarUrl: string;
  email: string;
};

function FriendRequestCard({
  id,
  username,
  avatarUrl,
  email,
}: FriendRequestCardProps) {
  return (
    <Card className="w-full p-2 flex flex-row justify-between items-center gap-2">
      <div className="truncate flex items-center gap-4">
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

        <section className="truncate flex flex-col justify-center">
          <h4 className="truncate">{username}</h4>

          <p className="text-muted-foreground text-xs truncate">{email}</p>
        </section>
      </div>

      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" onClick={() => {}}>
              <CheckCircleIcon className="size-4" />
            </Button>
          </TooltipTrigger>

          <TooltipContent>Accept Request</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="destructive" size="icon" onClick={() => {}}>
              <XCircleIcon className="size-4" />
            </Button>
          </TooltipTrigger>

          <TooltipContent>Decline Request</TooltipContent>
        </Tooltip>
      </div>
    </Card>
  );
}

export default FriendRequestCard;
