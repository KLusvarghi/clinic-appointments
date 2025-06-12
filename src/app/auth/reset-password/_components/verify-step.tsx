"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoadingOverlay } from "@/components/ui/loadingOverlay";

import { sendResetEmail } from "../_helpers/send-reset-email";
import { StepType } from "../_types";

interface VerifyStepProps {
  email?: string | null;
  setStep: (step: StepType) => void;
}

export function VerifyStep({ email, setStep }: VerifyStepProps) {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async () => {
      if (!email) throw new Error();
      await sendResetEmail(email);
    },
    onSuccess: () => {
      setStep("resend-email");
    },
    onError: () => {
      toast.error("Failed to resend email.");
    },
  });

  return (
    <>
      {mutation.isPending && <LoadingOverlay message="Resending email" />}
      <Card className="h-auto w-full border-0 shadow-2xl">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-semibold">
            Check your email
          </CardTitle>
          <CardDescription>
            If <strong>{email}</strong> matches a registered address, you will
            receive an email with password reset instructions. <br /> <br />
            If you haven't received an email within 5 minutes, check your spam
            folder,{" "}
            <button
              onClick={() => mutation.mutate()}
              className="cursor-pointer text-blue-600 underline"
            >
              request that the message be resent{" "}
            </button>
            , or{" "}
            <button
              onClick={() => router.push("/auth/sign-in")}
              className="cursor-pointer text-blue-600 underline"
              disabled={mutation.isPending}
            >
              try using another email address.
            </button>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Button
              type="button"
              className="h-12 w-full bg-blue-600 hover:bg-blue-700"
              onClick={() =>
                router.push(
                  `https://mail.google.com/mail/u/${email}/#search/from:notifications@credlin.com`,
                )
              }
            >
              Open Gmail
            </Button>
            <Button
              type="button"
              className="h-12 w-full text-blue-600"
              variant="ghost"
              onClick={() => router.push("/auth/sign-in")}
            >
              Go back to login
            </Button>
          </div>
          <div className="text-center text-sm">
            <span className="text-muted-foreground">New to Credlin? </span>
            <button
              onClick={() => router.push("/auth/sign-up")}
              className="cursor-pointer font-medium text-blue-600 hover:text-blue-700"
            >
              Create account
            </button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
