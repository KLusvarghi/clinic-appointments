import { useState } from "react";

import { StepType } from "../_types/schema";

export function useResetPasswordStep(initialEmail: string | null) {
  const [email, setEmail] = useState<string | null>(initialEmail);
  const [step, setStep] = useState<StepType>(initialEmail ? "verify-email" : "email");

  const toEmail = () => setStep("email");
  const toVerifyEmail = () => setStep("verify-email");
  const toResetPassword = () => setStep("reset-password");

  return {
    step,
    email,
    setEmail,
    toEmail,
    toVerifyEmail,
    toResetPassword,
  };
} 