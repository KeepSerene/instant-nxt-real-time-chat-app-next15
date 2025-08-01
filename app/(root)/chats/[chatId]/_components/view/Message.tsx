import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, formatTimestamp, getUsernameInitials } from "@/lib/utils";
import { CheckCheck } from "lucide-react";

interface MessageProps {
  isFromCurrentUser: boolean;
  senderName: string;
  sendAvatar: string;
  isLastMsgByUser: boolean;
  content: string[];
  createdAt: number;
  type: string;
  readReceipt?: React.ReactNode;
}

function Message({
  isFromCurrentUser,
  sendAvatar,
  senderName,
  isLastMsgByUser,
  content,
  createdAt,
  type,
  readReceipt,
}: MessageProps) {
  return (
    <div
      className={cn("flex items-end", isFromCurrentUser ? "justify-end" : "")}
    >
      <div
        className={cn(
          "w-full mx-2 flex flex-col",
          isFromCurrentUser ? "order-1 items-end" : "order-2 items-start"
        )}
      >
        <div
          className={cn(
            "max-w-[70%] px-4 py-2 rounded-lg",
            isFromCurrentUser
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground",
            !isLastMsgByUser && isFromCurrentUser ? "rounded-br-none" : "",
            !isLastMsgByUser && !isFromCurrentUser ? "rounded-bl-none" : ""
          )}
        >
          {type === "text" ? (
            <p className="text-wrap break-words break-all whitespace-pre-wrap">
              {content}
            </p>
          ) : null}

          <span
            className={cn(
              "w-full text-xs my-1 flex",
              isFromCurrentUser
                ? "text-primary-foreground justify-end"
                : "text-secondary-foreground justify-start"
            )}
          >
            {formatTimestamp(createdAt)}
          </span>
        </div>

        {/* only show read receipt for current user's messages and when receipt exists */}
        {isFromCurrentUser && readReceipt && (
          <div className="flex items-center gap-x-1 mt-1">
            <CheckCheck size={12} className="text-primary" />
            {readReceipt}
          </div>
        )}
      </div>

      <Avatar
        className={cn(
          "size-8 relative",
          isFromCurrentUser ? "order-2" : "order-1",
          isLastMsgByUser ? "invisible" : ""
        )}
      >
        <AvatarImage src={sendAvatar} />

        <AvatarFallback>{getUsernameInitials(senderName)}</AvatarFallback>
      </Avatar>
    </div>
  );
}

export default Message;
