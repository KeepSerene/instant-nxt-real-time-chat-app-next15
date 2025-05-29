"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { UserPlus2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const addFriendFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: "This field can't be empty!" })
    .email({ message: "Please enter a valid email address!" }),
});

function AddFriendDialog() {
  const form = useForm<z.infer<typeof addFriendFormSchema>>({
    resolver: zodResolver(addFriendFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const submitForm = () => {};

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
            Send a request to your friend to connect with them!
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
            ></FormField>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default AddFriendDialog;
