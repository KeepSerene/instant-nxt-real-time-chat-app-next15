import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { MessageSquareCode, Users2 } from "lucide-react";

export function useNavigation() {
  const pathname = usePathname();

  const navItems = useMemo(
    () => [
      {
        label: "Chats",
        href: "/chats",
        icon: MessageSquareCode,
        isActive: pathname.startsWith("/chats"),
      },
      {
        label: "Friends",
        href: "/friends",
        icon: Users2,
        isActive: pathname.startsWith("/friends"),
      },
    ],
    [pathname]
  );

  return navItems;
}
