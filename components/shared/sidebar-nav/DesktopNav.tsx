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
import { ThemeToggler } from "@/components/ui/theme/theme-toggler";
import { Badge } from "@/components/ui/badge";

function DesktopNav() {
  const navItems = useNavigation();

  return (
    <Card className="hidden lg:w-16 lg:h-full lg:px-2 lg:py-4 lg:flex lg:flex-col lg:justify-between lg:items-center">
      <nav>
        <ul className="flex flex-col items-center gap-4">
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
                      className="rounded-full px-2 absolute left-6 bottom-7"
                    >
                      {item.incomingRequestCount}
                    </Badge>
                  )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex flex-col items-center gap-4">
        <ThemeToggler />

        <UserButton />
      </div>
    </Card>
  );
}

export default DesktopNav;
