"use client";

import { useState } from "react";

import { StepType } from "../_types";
import { EmailStep } from "./email-step";
import { ResendStep } from "./resend-step";
import { VerifyStep } from "./verify-step";

interface ResetPasswordFormsProps {
  userEmail: string | null;
}

export function ResetPasswordForm({ userEmail }: ResetPasswordFormsProps) {
  const [email, setEmail] = useState<string | null>(userEmail);
  const [step, setStep] = useState<StepType>("verify-email");

  switch (step) {
    case "email":
      return <EmailStep email={email} setEmail={setEmail} setStep={setStep} />;
    case "verify-email":
      return <VerifyStep email={email} setStep={setStep} />;
    case "resend-email":
      return <ResendStep email={email} />;
  }
}
