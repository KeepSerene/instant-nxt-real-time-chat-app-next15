import ActionItemList from "@/components/shared/action-item-list/ActionItemList";
import type { ReactNode } from "react";

function ChatsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ActionItemList title="Your chats">Chats page</ActionItemList>

      {children}
    </>
  );
}

export default ChatsLayout;
