import { Card } from "@/components/ui/card";
import Image from "next/image";

function ChatFallback() {
  return (
    <Card className="hidden size-full bg-secondary text-secondary-foreground p-2 lg:flex justify-center items-center !gap-0">
      <Image
        src="/logo.svg"
        alt="InstantNXT logo"
        width={96}
        height={96}
        className="size-24"
      />

      <p className="text-muted-foreground text-center">
        Ready to spark a conversation? <br />
        Select or start a chat to experience <strong>InstantNXT</strong>!
      </p>
    </Card>
  );
}

export default ChatFallback;
