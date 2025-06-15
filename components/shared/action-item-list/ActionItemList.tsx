"use client";

import { useChat } from "@/hooks/useChat";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

type ActionItemListProps = {
  children: React.ReactNode;
  title: string;
  actionItem?: React.ReactNode;
};

function ActionItemList({ children, title, actionItem }: ActionItemListProps) {
  const { isActive } = useChat();

  return (
    <Card
      className={cn(
        "hidden lg:flex-none w-full lg:w-80 py-0 lg:flex flex-col gap-4",
        isActive ? "hidden" : "flex"
      )}
    >
      <section className="flex justify-between items-center p-2">
        <h1 className="text-2xl font-semibold capitalize tracking-tight">
          {title}
        </h1>

        {actionItem && actionItem}
      </section>

      <div className="flex-1 p-2 pt-0 overflow-y-auto flex flex-col justify-start items-center gap-2">
        {children}
      </div>
    </Card>
  );
}

export default ActionItemList;
