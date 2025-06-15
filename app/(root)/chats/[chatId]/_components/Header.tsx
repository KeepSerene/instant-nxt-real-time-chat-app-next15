import FriendAvatar from "@/components/shared/FriendAvatar";
import { Card } from "@/components/ui/card";
import { CircleArrowLeft } from "lucide-react";
import Link from "next/link";

function Header({ avatarUrl, name }: { avatarUrl?: string; name: string }) {
  return (
    <Card className="w-full rounded-lg p-2 flex justify-between items-center">
      <section className="w-full flex items-center gap-2">
        <Link
          href="/chats"
          aria-label="Go back to your chats page"
          className="lg:hidden transition-colors hover:text-primary focus-visible:text-primary"
        >
          <CircleArrowLeft />
        </Link>

        <FriendAvatar avatarUrl={avatarUrl ?? ""} username={name} />

        <h2 className="font-semibold">{name}</h2>
      </section>
    </Card>
  );
}

export default Header;
