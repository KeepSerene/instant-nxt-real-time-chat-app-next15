import AvatarComponent from "@/components/shared/AvatarComponent";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { CircleArrowLeft, Settings2Icon } from "lucide-react";
import Link from "next/link";

interface HeaderProps {
  avatarUrl?: string;
  name: string;
  options?: {
    label: string;
    isDestructive: boolean;
    onClickHandler: () => void;
  }[];
}

function Header({ avatarUrl, name, options }: HeaderProps) {
  return (
    <Card className="w-full rounded-lg p-2 flex flex-row justify-between items-center">
      <section className="w-full flex items-center gap-2">
        <Link
          href="/chats"
          aria-label="Go back to chats page"
          className="lg:hidden transition-colors hover:text-primary focus-visible:text-primary"
        >
          <CircleArrowLeft />
        </Link>

        <AvatarComponent avatarUrl={avatarUrl ?? ""} username={name} />

        <h2 className="font-semibold">{name}</h2>
      </section>

      <div className="flex items-center gap-2">
        {options && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                aria-label="Open settings"
              >
                <Settings2Icon />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              {options.map((option, index) => (
                <DropdownMenuItem
                  key={index}
                  onClick={option.onClickHandler}
                  className={cn(
                    "font-semibold cursor-pointer",
                    option.isDestructive ? "text-destructive" : ""
                  )}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </Card>
  );
}

export default Header;
