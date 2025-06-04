"use client";

import type { Id } from "@/convex/_generated/dataModel";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUsernameInitials } from "@/lib/utils";
import { CheckCircleIcon, Loader, User2Icon, XCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePendingMutation } from "@/hooks/usePendingMutation";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { ConvexError } from "convex/values";

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
  const { mutate: rejectFriendRequest, isPending } = usePendingMutation(
    api.request.reject
  );

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
            <Button
              size="icon"
              onClick={() => {}}
              disabled={isPending}
              aria-label={
                isPending ? "Accepting request..." : "Accept friend request"
              }
            >
              <CheckCircleIcon className="size-4" />
            </Button>
          </TooltipTrigger>

          <TooltipContent>Accept Request</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="destructive"
              size="icon"
              onClick={() =>
                rejectFriendRequest({ id })
                  .then((_) => {
                    toast.success("Friend request rejected successfully!");
                  })
                  .catch((err) => {
                    err instanceof ConvexError
                      ? toast.error(err.data)
                      : "An unexpected error occurred while rejecting the request!";
                  })
              }
              disabled={isPending}
              aria-label={
                isPending ? "Rejecting request..." : "Reject friend request"
              }
            >
              {isPending ? (
                <Loader className="size-4 animate-spin" />
              ) : (
                <XCircleIcon className="size-4" />
              )}
            </Button>
          </TooltipTrigger>

          <TooltipContent>Reject Request</TooltipContent>
        </Tooltip>
      </div>
    </Card>
  );
}

export default FriendRequestCard;
