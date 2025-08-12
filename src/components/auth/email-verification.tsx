"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Mail, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface EmailVerificationProps {
  email: string;
  className?: string;
}

export function EmailVerification({
  email,
  className,
}: EmailVerificationProps) {
  const [isResending, setIsResending] = useState(false);
  const [lastSentTime, setLastSentTime] = useState<Date | null>(null);
  const [countdown, setCountdown] = useState(0);

  const handleResendEmail = async () => {
    if (lastSentTime && countdown > 0) {
      return;
    }

    setIsResending(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/resend-verification/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to resend verification email");
      }

      setLastSentTime(new Date());
      setCountdown(60);

      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      toast.success("Verification email sent!", {
        description: "Please check your inbox and spam folder.",
      });
    } catch (error) {
      toast.error("Failed to resend email", {
        description: "Please try again later or contact support.",
      });
      console.error("Resend email error:", error);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="relative max-w-md w-full">
        <div
          className={cn(
            "relative bg-card rounded-2xl shadow-xl p-8 ",
            className
          )}
        >
          <div className="text-center">
            {/* Icon */}
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-primary mb-6">
              <Mail className="h-10 w-10 text-primary-foreground" />
            </div>

            {/* Header */}
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Verify Your Email
            </h2>
            <p className="text-muted-foreground mb-6">
              Account activation link has been sent to the email address you
              provided.
            </p>

            {/* Email display */}
            <div className="bg-muted rounded-lg p-4 mb-6 border">
              <p className="text-sm font-medium text-muted-foreground">
                Email sent to:
              </p>
              <p className="text-primary font-semibold break-all">{email}</p>
            </div>

            {/* Resend section */}
            <div className="border-t pt-6">
              <p className="text-sm text-muted-foreground mb-4">
                Didn&apos;t get the email?
              </p>

              <Button
                onClick={handleResendEmail}
                disabled={isResending || countdown > 0}
                variant="outline"
                className="mb-4 px-4 py-2 hover:border-primary hover:text-primary inline-flex items-center justify-center"
              >
                {isResending ? (
                  <div className="flex items-center justify-center">
                    <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                    Sending...
                  </div>
                ) : countdown > 0 ? (
                  `Resend in ${countdown}s`
                ) : (
                  <div className="flex items-center justify-center text-primary font-bold text-sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Send it again
                  </div>
                )}
              </Button>

              <div className="text-xs text-muted-foreground space-y-1">
                <p>• Check your spam folder</p>
                <p>• Wait a few minutes before requesting again</p>
              </div>
            </div>

            {/* Login link */}
            <div className="mt-8 pt-6 border-t">
              <p className="text-sm text-muted-foreground mb-4">
                Already verified your email?
              </p>
              <Link href="/login">
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  Continue to Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
