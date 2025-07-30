import type { Metadata } from "next";
import RedirectHandler from "@/components/shared/RedirectHandler";

export const metadata: Metadata = {
  title: "Home",
  description: "InstantNXT - Real-Time Conversations, Redefined",
};

export default function HomePage() {
  return <RedirectHandler />;
}
