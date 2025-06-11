import ChatList from "./_components/ChatList";
import ChatsLayoutContent from "./_components/ChatsLayoutContent";

export default async function ChatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="size-full flex gap-4">
      <ChatList />

      <ChatsLayoutContent>{children}</ChatsLayoutContent>
    </div>
  );
}
