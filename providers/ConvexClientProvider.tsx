"use client";

import { ReactNode } from "react";
import {
  Authenticated,
  AuthLoading,
  ConvexReactClient,
  Unauthenticated,
} from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useAuth } from "@clerk/nextjs";
import LoadingScreen from "@/components/shared/LoadingScreen";

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error("Missing NEXT_PUBLIC_CONVEX_URL in your .env.local file");
}

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);

export default function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      {/* Unauthenticated users are handled by the root page routing */}
      <Unauthenticated>
        <LoadingScreen />
      </Unauthenticated>

      <Authenticated>{children}</Authenticated>

      <AuthLoading>
        <LoadingScreen />
      </AuthLoading>
    </ConvexProviderWithClerk>
  );
}
