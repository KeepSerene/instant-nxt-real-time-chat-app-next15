"use client";

import { useChats } from "@/hooks/useChats";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ActionItemListProps = {
  children: React.ReactNode;
  title: string;
  actionItem?: React.ReactNode;
};

function ActionItemList({ children, title, actionItem }: ActionItemListProps) {
  const { isActive } = useChats();

  return (
    <Card
      className={cn(
        "hidden size-full p-2 lg:flex-none lg:w-80",
        isActive ? "lg:block" : "block"
      )}
    >
      <section className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-semibold capitalize tracking-tight">
          {title}
        </h1>

        {actionItem && actionItem}
      </section>

      <div className="size-full flex flex-col justify-start items-center gap-2">
        {children}
      </div>
    </Card>
  );
}

export default ActionItemList;
