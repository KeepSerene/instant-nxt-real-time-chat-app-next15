"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingScreen from "@/components/shared/LoadingScreen";

export default function RedirectHandler() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn) {
        // User is authenticated, redirect to chats
        router.replace("/chats");
      } else {
        // User is not authenticated, redirect to sign-in
        router.replace("/sign-in");
      }
    }
  }, [isLoaded, isSignedIn, router]);

  // loading while determining auth state
  return <LoadingScreen />;
}
