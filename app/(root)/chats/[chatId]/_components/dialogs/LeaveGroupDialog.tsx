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

type LeaveGroupDialogProps = {
  chatId: Id<"chats">;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export default function LeaveGroupDialog({
  chatId,
  isOpen,
  setIsOpen,
}: LeaveGroupDialogProps) {
  const { mutate: leaveGroupChat, isPending } = usePendingMutation(
    api.chat.deleteGroup
  );

  const handleLeaveGroupChat = async () => {
    try {
      await leaveGroupChat({ chatId });
      toast.success("Left Group chat successfully!");
      setIsOpen(false);
    } catch (err) {
      const errMsg =
        err instanceof ConvexError ? err.data : "Oops! Something went wrong.";
      console.error("Error deleting group:", err);
      toast.error(errMsg);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Leave Group Chat?</AlertDialogTitle>
          <AlertDialogDescription>
            You'll no longer be a part of this group: can no longer view or send
            messages!
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            onClick={handleLeaveGroupChat}
          >
            Leave
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
