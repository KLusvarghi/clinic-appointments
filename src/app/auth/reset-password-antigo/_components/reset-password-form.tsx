"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useResetPasswordMutation } from "../_hooks/use-reset-password-mutation";
import { useResetPasswordStep } from "../_hooks/use-reset-password-step";
import { emailSchema, resetPasswordSchema } from "../_types/schema";
import { EmailStep } from "./email-step";
import { ResetPasswordStep } from "./reset-password-step";
import { VerifyStep } from "./verify-step";

interface ResetPasswordFormProps {
  userEmail: string | null;
}

export function ResetPasswordForm({ userEmail }: ResetPasswordFormProps) {
  const router = useRouter();
  const { step, email, setEmail, toEmail, toVerifyEmail, toResetPassword } =
    useResetPasswordStep(userEmail);

  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: userEmail || "" },
  });

  const resetPasswordForm = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const resetPasswordMut = useResetPasswordMutation(
    () => {
      router.push("/auth/sign-in");
    },
    (msg) => {
      resetPasswordForm.setError("password", { type: "manual", message: msg });
      resetPasswordForm.setValue("password", "");
      resetPasswordForm.setValue("confirmPassword", "");
      resetPasswordForm.setFocus("password");
    },
  );

  const descriptions = {
    email:
      "Enter the email associated with your account to receive a password reset link.",
    "verify-email": "Enter the verification code sent to your email.",
    "reset-password": "Enter your new password.",
  };

  return (
    <Card className="h-auto w-full border-0 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-start text-2xl font-semibold">
          Reset your password
        </CardTitle>
        <CardDescription>{descriptions[step]}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {step === "email" && (
          <EmailStep
            email={email}
            setEmail={setEmail}
            setStep={toVerifyEmail}
            url="reset-password"
          />
        )}
        {step === "verify-email" && email && (
          <VerifyStep
            email={email}
            onSuccess={toResetPassword}
            url="reset-password"
          />
        )}
        {step === "reset-password" && (
          <ResetPasswordStep
            form={resetPasswordForm}
            isLoading={resetPasswordMut.isPending}
            onSubmit={(values) => resetPasswordMut.mutate(values)}
            onBack={toEmail}
          />
        )}
      </CardContent>
    </Card>
  );
}
