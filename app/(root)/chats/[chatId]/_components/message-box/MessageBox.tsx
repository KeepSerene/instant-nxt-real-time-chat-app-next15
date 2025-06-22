"use client";

import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { api } from "@/convex/_generated/api";
import { useChat } from "@/hooks/useChat";
import { usePendingMutation } from "@/hooks/usePendingMutation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ConvexError } from "convex/values";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import TextareaAutosize from "react-textarea-autosize";
import { Button } from "@/components/ui/button";
import { SendIcon } from "lucide-react";

const chatMsgSchema = z.object({
  content: z.string().trim().min(1, {
    message: "Message cannot be empty or just whitespace!",
  }),
});

function MessageBox() {
  const { chatId } = useChat();
  const { mutate: createMessage, isPending } = usePendingMutation(
    api.message.create
  );
  const form = useForm<z.infer<typeof chatMsgSchema>>({
    resolver: zodResolver(chatMsgSchema),
    defaultValues: {
      content: "",
    },
  });
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const content = form.watch("content");
  const isDisabled = isPending || !content?.trim();

  const onSubmit = async (values: z.infer<typeof chatMsgSchema>) => {
    try {
      await createMessage({
        chatId,
        type: "text",
        content: [values.content],
      });
      form.reset();
    } catch (err) {
      const errMsg =
        err instanceof ConvexError
          ? err.data
          : "An unexpected error occurred while creating the message!";
      console.error(errMsg);
      toast.error(errMsg);
    }
  };

  const handleTextareaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { value, selectionStart } = event.target;

    if (selectionStart !== null) {
      form.setValue("content", value);
    }
  };

  return (
    <Card className="w-full rounded-lg p-2 relative">
      <div className="w-full flex gap-2">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full flex justify-between items-center gap-2"
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl className="size-full">
                    <TextareaAutosize
                      rows={1}
                      maxRows={3}
                      {...field}
                      ref={(elem) => {
                        field.ref(elem);
                        textareaRef.current = elem;
                      }}
                      onChange={handleTextareaChange}
                      onInput={(e) =>
                        handleTextareaChange(
                          e as React.ChangeEvent<HTMLTextAreaElement>
                        )
                      }
                      onKeyDown={async (event) => {
                        if (event.key === "Enter" && !event.shiftKey) {
                          event.preventDefault();
                          await form.handleSubmit(onSubmit)();
                        }
                      }}
                      placeholder="Type your message here..."
                      className="w-full min-h-full bg-card text-card-foreground border-0 p-1.5 outline-0 resize-none placeholder:text-muted-foreground"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              size="icon"
              disabled={isDisabled}
              aria-label="Send message"
            >
              <SendIcon />
            </Button>
          </form>
        </Form>
      </div>
    </Card>
  );
}

export default MessageBox;
