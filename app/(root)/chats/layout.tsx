import ActionItemList from "@/components/shared/action-item-list/ActionItemList";

function ChatsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ActionItemList title="Your chats">Chats page</ActionItemList>

      {children}
    </>
  );
}

export default ChatsLayout;
