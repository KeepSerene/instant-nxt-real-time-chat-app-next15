"use client";

import { z } from "zod";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { usePendingMutation } from "@/hooks/usePendingMutation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { toast } from "sonner";
import { ConvexError } from "convex/values";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { BadgePlus, Loader, Users2Icon, X } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AvatarComponent from "@/components/shared/AvatarComponent";

// Schema for form validation
const createGroupSchema = z.object({
  name: z.string().min(1, { message: "Give your group a name" }),
  members: z
    .array(z.string())
    .min(1, { message: "Select at least one member" }),
});

type CreateGroupFormValues = z.infer<typeof createGroupSchema>;

export default function CreateGroupDialog() {
  // Fetch all friends
  const friends = useQuery(api.friends.getFriends) || [];

  // Mutation to create group
  const { mutate: createGroup, isPending } = usePendingMutation(
    api.chat.createGroup
  );

  // RHF setup
  const form = useForm<CreateGroupFormValues>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: { name: "", members: [] },
  });

  const selectedFriendIds = form.watch("members");

  // Friends not yet selected
  const availableFriends = useMemo(
    () => friends.filter((f) => !selectedFriendIds.includes(f._id)),
    [friends, selectedFriendIds]
  );

  // On form submit
  const onSubmit = async (values: CreateGroupFormValues) => {
    try {
      await createGroup(values);
      form.reset();
      toast.success("Group created 🎉");
    } catch (err) {
      const message =
        err instanceof ConvexError ? err.data : "Unable to create group";
      toast.error(message);
    }
  };

  return (
    <Dialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              aria-label="Start a new group chat"
            >
              <Users2Icon size={18} />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>New Group Chat</p>
        </TooltipContent>
      </Tooltip>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>New Group Chat</DialogTitle>
          <DialogDescription>
            Name your group and pick friends to start a conversation
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Group name input */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., Weekend Plans" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Member selection dropdown */}
            <FormField
              control={form.control}
              name="members"
              render={() => (
                <FormItem>
                  <FormLabel>Select Members</FormLabel>
                  <FormControl>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between"
                          disabled={availableFriends.length === 0}
                        >
                          {availableFriends.length > 0
                            ? "Add Friends..."
                            : "All friends added"}
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent
                        align="start"
                        sideOffset={4}
                        className="w-full"
                      >
                        {availableFriends.map((friend) => (
                          <DropdownMenuCheckboxItem
                            key={friend._id}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                form.setValue("members", [
                                  ...selectedFriendIds,
                                  friend._id,
                                ]);
                              }
                            }}
                            className="flex items-center space-x-2 p-2"
                          >
                            <AvatarComponent {...friend} />
                            <span className="truncate">{friend.username}</span>
                          </DropdownMenuCheckboxItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Preview of added members */}
            {selectedFriendIds.length > 0 && (
              <div className="bg-muted rounded-md px-2 py-3 overflow-x-auto flex gap-x-4">
                {friends
                  .filter((f) => selectedFriendIds.includes(f._id))
                  .map((member) => (
                    <div
                      key={member._id}
                      className="flex-shrink-0 size-12 relative"
                    >
                      {/* Avatar */}
                      <AvatarComponent
                        {...member}
                        className="size-full rounded-full ring-2 ring-primary/80 shadow-sm"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          form.setValue(
                            "members",
                            selectedFriendIds.filter((id) => id !== member._id)
                          )
                        }
                        aria-label={`Remove ${member.username}`}
                        title="Remove"
                        className="absolute -top-1 -right-1 size-5 bg-primary rounded-full flex justify-center items-center shadow hover:bg-primary/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive transition-colors duration-150"
                      >
                        <X
                          size={14}
                          className="text-foreground hover:text-destructive focus-visible:text-destructive"
                        />
                      </button>
                    </div>
                  ))}
              </div>
            )}

            <DialogFooter>
              <Button
                type="submit"
                className="w-full flex justify-center items-center gap-x-1"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader className="animate-spin" size={16} />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <BadgePlus size={16} />
                    <span>Create Group</span>
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
