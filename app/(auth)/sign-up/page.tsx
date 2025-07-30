import { SignUp } from "@clerk/nextjs";
import {
  MessageSquareCode,
  Users,
  Zap,
  Sparkles,
  Waves,
  Coffee,
} from "lucide-react";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Join InstantNXT - Real-Time Conversations, Redefined",
};

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative bg icons */}
      <div className="absolute inset-0 pointer-events-none">
        <MessageSquareCode className="absolute top-8 left-8 w-16 h-16 md:w-20 md:h-20 text-muted-foreground/20 rotate-12" />
        <Users className="absolute top-12 right-12 w-14 h-14 md:w-18 md:h-18 text-muted-foreground/20 -rotate-12" />
        <Zap className="absolute bottom-16 left-16 w-12 h-12 md:w-16 md:h-16 text-muted-foreground/20 rotate-45" />
        <Sparkles className="absolute bottom-8 right-8 w-18 h-18 md:w-24 md:h-24 text-muted-foreground/20 -rotate-6" />
        <Waves className="absolute top-1/2 left-4 w-10 h-10 md:w-14 md:h-14 text-muted-foreground/20 -translate-y-1/2 rotate-90" />
        <Coffee className="absolute top-1/3 right-4 w-8 h-8 md:w-12 md:h-12 text-muted-foreground/20 rotate-12" />

        <div className="absolute top-1/4 left-1/4 w-6 h-6 md:w-8 md:h-8 bg-primary/10 rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-4 h-4 md:w-6 md:h-6 bg-primary/10 rounded-full animate-pulse delay-1000" />
        <div className="absolute top-3/4 left-1/8 w-5 h-5 md:w-7 md:h-7 bg-primary/10 rounded-full animate-pulse delay-2000" />
      </div>

      {/* Main content */}
      <div className="w-full max-w-md relative z-10">
        {/* Branding */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="relative w-12 h-12 md:w-16 md:h-16 mr-3">
              <Image
                src="/logo.svg"
                alt="InstantNXT Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              InstantNXT
            </h1>
          </div>

          <p className="text-muted-foreground text-sm md:text-base mb-2">
            Real-Time Conversations, Redefined
          </p>

          <div className="w-16 h-1 bg-gradient-to-r from-primary to-primary/50 mx-auto rounded-full" />
        </div>

        {/* Sign-up component */}
        <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 md:p-8 shadow-xl">
          <div className="text-center mb-6">
            <h2 className="text-xl md:text-2xl font-semibold mb-2">
              Join InstantNXT
            </h2>
            <p className="text-muted-foreground text-sm">
              Create your account and start connecting instantly
            </p>
          </div>

          <SignUp
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-none border-0 bg-transparent",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton:
                  "w-full bg-primary hover:bg-primary/90 text-primary-foreground border-0 font-medium py-3 rounded-lg transition-all duration-200 hover:scale-[1.02]",
                socialButtonsBlockButtonText: "font-medium",
                footerAction: "hidden",
                formButtonPrimary:
                  "w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-lg font-medium transition-all duration-200 hover:scale-[1.02]",
                formFieldInput:
                  "bg-background border-border rounded-lg py-3 px-4 focus:border-primary focus:ring-1 focus:ring-primary",
                formFieldLabel: "text-foreground font-medium",
                identityPreviewEditButton: "text-primary hover:text-primary/80",
              },
            }}
            signInUrl="/sign-in"
          />
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
