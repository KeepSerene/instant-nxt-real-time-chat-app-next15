import type { ReactNode } from "react";
import MobileNav from "@/components/shared/sidebar/nav/MobileNav";
import DesktopNav from "@/components/shared/sidebar/nav/DesktopNav";

function RootLayout({ children }: { children: ReactNode }) {
  return (
    <div className="size-full p-4 flex flex-col lg:flex-row gap-4">
      <MobileNav />
      <DesktopNav />

      {/* Subtract the bottom nav height (= 80px) on small screens */}
      <main className="w-full h-[calc(100%-80px)] lg:h-full flex gap-4">
        {children}
      </main>
    </div>
  );
}

export default RootLayout;
