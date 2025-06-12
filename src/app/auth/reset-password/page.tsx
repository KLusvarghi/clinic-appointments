"use client";

import { useSearchParams } from "next/navigation";

import { ResetPasswordForm } from "./_components/reset-password-forms";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  return (
    <div className="flex w-screen items-center justify-center">
      <div className="w-[400px]">
        <ResetPasswordForm userEmail={email} />
      </div>
    </div>
  );
}
