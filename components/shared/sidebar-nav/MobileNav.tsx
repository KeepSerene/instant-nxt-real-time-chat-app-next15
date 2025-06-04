"use client";

import { useNavigation } from "@/hooks/useNavigation";
import { Card } from "@/components/ui/card";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useChats } from "@/hooks/useChats";
import { ThemeToggler } from "@/components/ui/theme/theme-toggler";
import { Badge } from "@/components/ui/badge";

function MobileNav() {
  const { isActive } = useChats();
  const navItems = useNavigation();

  if (isActive) return null;

  return (
    <Card className="w-[calc(100%-2rem)] h-16 p-2 flex flex-row items-center fixed bottom-4 lg:hidden">
      <nav className="w-full">
        <ul className="flex justify-evenly items-center">
          {navItems.map((item, index) => (
            <li key={index} className="relative">
              <Link href={item.href}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={item.isActive ? "default" : "outline"}
                      size="icon"
                    >
                      <item.icon />
                    </Button>
                  </TooltipTrigger>

                  <TooltipContent>
                    <span>{item.label}</span>
                  </TooltipContent>
                </Tooltip>

                {typeof item.incomingRequestCount === "number" &&
                  item.incomingRequestCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="px-2 absolute left-6 bottom-7"
                    >
                      {item.incomingRequestCount}
                    </Badge>
                  )}
              </Link>
            </li>
          ))}

          <li>
            <ThemeToggler />
          </li>

          <li>
            <UserButton />
          </li>
        </ul>
      </nav>
    </Card>
  );
}

export default MobileNav;
