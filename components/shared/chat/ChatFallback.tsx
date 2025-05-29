import { Card } from "@/components/ui/card";

function ChatFallback() {
  return (
    <Card className="hidden size-full bg-secondary text-secondary-foreground p-2 lg:flex justify-center items-center">
      <p>Select/start a chat to get started</p>
    </Card>
  );
}

export default ChatFallback;
