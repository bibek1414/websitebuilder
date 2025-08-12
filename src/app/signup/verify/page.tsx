"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { EmailVerification } from "@/components/auth/email-verification";
import { useRouter } from "next/navigation";

export default function VerifyPage() {
  const { verificationEmail, setVerificationEmail } = useAuth();
  const [email, setEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Get email from context first
    if (verificationEmail) {
      setEmail(verificationEmail);
      return;
    }

    // If not in context, check localStorage
    const storedEmail = localStorage.getItem("verificationEmail");
    if (storedEmail) {
      setEmail(storedEmail);
      setVerificationEmail(storedEmail);
      return;
    }

    // If no email found anywhere, redirect to signup
    router.push("/signup");
  }, [verificationEmail, setVerificationEmail, router]);

  // Show loading while determining if we have an email
  if (!email) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <EmailVerification email={email} />;
}