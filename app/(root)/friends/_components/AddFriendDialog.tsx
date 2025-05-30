"use client";

import { api } from "@/convex/_generated/api";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { LoaderIcon, SendIcon, UserPlus2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { usePendingMutation } from "@/hooks/usePendingMutation";
import { ConvexError } from "convex/values";
import { toast } from "sonner";

const addFriendFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: "This field can't be empty!" })
    .email({ message: "Please enter a valid email address!" }),
});

function AddFriendDialog() {
  const { isPending, mutate: sendRequest } = usePendingMutation(
    api.request.create
  );

  const form = useForm<z.infer<typeof addFriendFormSchema>>({
    resolver: zodResolver(addFriendFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const submitForm = async (values: z.infer<typeof addFriendFormSchema>) => {
    try {
      await sendRequest({ email: values.email });
      form.reset();
      toast.success("Connection request sent successfully!");
    } catch (err) {
      console.error(
        err instanceof ConvexError
          ? err.data
          : `An unexpected error occurred: ${err}`
      );
      toast.error(
        err instanceof ConvexError ? err.data : "An unexpected error occurred!"
      );
    }
  };

  return (
    <Dialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon" asChild>
            <DialogTrigger>
              <UserPlus2 />
            </DialogTrigger>
          </Button>
        </TooltipTrigger>

        <TooltipContent>
          <span>Add Friend</span>
        </TooltipContent>
      </Tooltip>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Friend</DialogTitle>

          <DialogDescription>
            Send your friend a connection request!
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(submitForm)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter your friend's email address</FormLabel>

                  <FormControl>
                    <Input {...field} placeholder="example@email.com" />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="submit"
                disabled={false}
                className="flex items-center gap-1"
              >
                {isPending ? (
                  <>
                    <LoaderIcon className="animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <SendIcon />
                    <span className="capitalize">Send request</span>
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

export default AddFriendDialog;
