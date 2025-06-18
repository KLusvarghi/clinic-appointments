"use client";

import { useSearchParams } from "next/navigation";

import { ResetPasswordForm } from "./_components/reset-password-form";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-[400px]">
        <ResetPasswordForm userEmail={email} />
      </div>
    </div>
  );
}
