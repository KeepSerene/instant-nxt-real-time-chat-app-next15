import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { MessageSquareCode, Users2 } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function useNavigation() {
  const pathname = usePathname();
  const incomingRequestCount = useQuery(api.requests.count);
  const chats = useQuery(api.chats.get);
  const unreadMsgCount = useMemo(() => {
    return chats?.reduce((acc, curr) => acc + curr.unreadMsgCount, 0);
  }, [chats]);

  const navItems = useMemo(
    () => [
      {
        label: "Chats",
        href: "/chats",
        icon: MessageSquareCode,
        isActive: pathname.startsWith("/chats"),
        unreadMsgCount,
      },
      {
        label: "Friends",
        href: "/friends",
        icon: Users2,
        isActive: pathname.startsWith("/friends"),
        incomingRequestCount,
      },
    ],
    [pathname, incomingRequestCount, unreadMsgCount]
  );

  return navItems;
}
