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

type DeleteGroupDialogProps = {
  chatId: Id<"chats">;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export default function DeleteGroupDialog({
  chatId,
  isOpen,
  setIsOpen,
}: DeleteGroupDialogProps) {
  const { mutate: deleteGroupChat, isPending } = usePendingMutation(
    api.chat.deleteGroup
  );

  const handleDeleteGroupChat = async () => {
    try {
      await deleteGroupChat({ chatId });
      toast.success("Group chat deleted successfully!");
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
          <AlertDialogTitle>Delete Group Chat?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently remove the group and all its messages!
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            onClick={handleDeleteGroupChat}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
