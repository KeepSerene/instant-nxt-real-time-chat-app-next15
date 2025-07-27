"use client";

import type { Id } from "@/convex/_generated/dataModel";
import { Card } from "@/components/ui/card";
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
import AvatarComponent from "@/components/shared/AvatarComponent";

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
  const { mutate: acceptFriendRequest, isPending: acceptancePending } =
    usePendingMutation(api.request.accept);
  const { mutate: rejectFriendRequest, isPending: rejectionPending } =
    usePendingMutation(api.request.reject);

  return (
    <Card className="w-full p-2 flex flex-row justify-between items-center gap-2">
      <div className="truncate flex items-center gap-4">
        <AvatarComponent avatarUrl={avatarUrl} username={username} />

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
              onClick={() => {
                acceptFriendRequest({ id })
                  .then((_) => {
                    toast.success(
                      "Yay! You have a new friend now. Happy chatting..."
                    );
                  })
                  .catch((err) => {
                    toast.error(
                      err instanceof ConvexError
                        ? err.data
                        : "An unexpected error occurred while accepting the request!"
                    );
                  });
              }}
              disabled={acceptancePending || rejectionPending}
              aria-label={
                acceptancePending
                  ? "Accepting request..."
                  : "Accept friend request"
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
                    toast.error(
                      err instanceof ConvexError
                        ? err.data
                        : "An unexpected error occurred while rejecting the request!"
                    );
                  })
              }
              disabled={rejectionPending || acceptancePending}
              aria-label={
                rejectionPending
                  ? "Rejecting request..."
                  : "Reject friend request"
              }
            >
              {rejectionPending ? (
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
