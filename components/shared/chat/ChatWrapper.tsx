import { Card } from "@/components/ui/card";

function ChatWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Card className="w-full h-[calc(100dvh-2rem)] lg:h-full p-2 flex flex-col gap-2">
      {children}
    </Card>
  );
}

export default ChatWrapper;
