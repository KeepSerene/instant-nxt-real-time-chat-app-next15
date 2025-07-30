"use client";

import { Id } from "@/convex/_generated/dataModel";
import { usePendingMutation } from "@/hooks/usePendingMutation";
import { Dispatch, SetStateAction } from "react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { ConvexError } from "convex/values";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type RemoveFriendDialogProps = {
  chatId: Id<"chats">;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

function RemoveFriendDialog({
  chatId,
  isOpen,
  setIsOpen,
}: RemoveFriendDialogProps) {
  const { mutate: deleteFriendChat, isPending } = usePendingMutation(
    api.friend.deleteChat
  );

  const handleDeleteFriendChat = async () => {
    try {
      await deleteFriendChat({ chatId });
      toast.success(
        "You and your friend are now disconnected! This chat and all its messages have been permanently deleted."
      );
    } catch (err) {
      const errMsg =
        err instanceof ConvexError ? err.data : "An unexpected error occurred!";
      console.error("Error:", err);
      toast.error(errMsg);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove this conversation?</AlertDialogTitle>

          <AlertDialogDescription>
            You&apos;re about to end your connection with this friend. All
            messages in this one-on-one chat will be permanently erased and you
            won&apos;t be able to message them again unless you reconnect. This
            can&apos;t be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>

          <AlertDialogAction
            disabled={isPending}
            onClick={handleDeleteFriendChat}
          >
            Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default RemoveFriendDialog;
