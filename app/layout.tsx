import "./globals.css";
import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";

export const metadata: Metadata = {
  title: {
    template: "%s – InstantNXT",
    default: "InstantNXT – Real-Time Conversations, Redefined",
  },
  description:
    "Connect instantly with InstantNXT — a Next.js 15 chat app powered by Convex for lightning-fast data and ShadCN UI for a sleek, seamless interface.",
};

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${monaSans.variable} antialiased`}>{children}</body>
    </html>
  );
}
