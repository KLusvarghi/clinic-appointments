"use client";

import { StepType, resetPasswordSchema } from "../_types/schema";
import { EmailStep } from "../_components/email-step";
import { VerifyStep } from "../_components/verify-step";
import { ResetPasswordStep } from "../_components/reset-step";
import { UseFormReturn } from "react-hook-form";
import { UseMutationResult } from "@tanstack/react-query";

export function getStepContent(params: {
  step: StepType;
  email: string | null;
  form: UseFormReturn<z.infer<typeof resetPasswordSchema>>;
  mutation: UseMutationResult<void, Error, z.infer<typeof resetPasswordSchema>>;
  toEmail: () => void;
  toVerifyEmail: () => void;
  toResetPassword: () => void;
}) {
  const { step, email, form, mutation, toEmail, toVerifyEmail, toResetPassword } = params;

  switch (step) {
    case "email":
      return {
        title: "Reset your password",
        description:
          "Enter the email associated with your account to receive a password reset link.",
        content: (
          <EmailStep
            email={email}
            setEmail={(email) => toVerifyEmail()}
            setStep={toVerifyEmail}
            url="reset-password"
          />
        ),
      };
    case "verify-email":
      return {
        title: "Verify your email",
        description: "Enter the verification code sent to your email.",
        content: (
          <VerifyStep
            email={email!}
            onSuccess={toResetPassword}
            url="reset-password"
          />
        ),
      };
    case "reset-password":
      return {
        title: "Create a new password",
        description: "Enter your new password.",
        content: (
          <ResetPasswordStep
            form={form}
            isLoading={mutation.isPending}
            onSubmit={(values) => mutation.mutate(values)}
            onBack={toEmail}
          />
        ),
      };
  }
}
