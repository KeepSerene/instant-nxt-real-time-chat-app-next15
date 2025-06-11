import "./globals.css";
import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import ConvexClientProvider from "@/providers/ConvexClientProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ui/theme/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import MobileNav from "@/components/shared/sidebar-nav/MobileNav";
import DesktopNav from "@/components/shared/sidebar-nav/DesktopNav";

export const metadata: Metadata = {
  title: {
    template: "%s – InstantNXT",
    default: "InstantNXT – Real-Time Conversations, Redefined",
  },
  description:
    "Connect instantly with InstantNXT — a Next.js 15 chat app powered by Convex for lightning-fast data and ShadCN UI for a sleek, seamless interface.",
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
};

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});

export default function GlobalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${monaSans.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClerkProvider>
            <ConvexClientProvider>
              <TooltipProvider>
                <div className="size-full p-4 flex flex-col lg:flex-row gap-4">
                  <MobileNav />
                  <DesktopNav />

                  {/* Subtract the bottom nav height (= 80px) on small screens */}
                  <main className="w-full h-[calc(100%-80px)] lg:h-full">
                    {children}
                  </main>
                </div>
              </TooltipProvider>

              <Toaster richColors position="top-right" />
            </ConvexClientProvider>
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
