"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { sendEmailRequest } from "@/client-actions/send-email";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { useResendTimer } from "../_hooks/use-resend-timer";
import { verifyCodeSchema } from "../_types/schema";

interface VerifyStepProps {
  email: string;
  onSuccess: () => void;
  url: string;
}

export function VerifyStep({ email, onSuccess, url }: VerifyStepProps) {
  const router = useRouter();
  const { timeLeft, isTimerActive, startTimer } = useResendTimer();

  const form = useForm<z.infer<typeof verifyCodeSchema>>({
    resolver: zodResolver(verifyCodeSchema),
    defaultValues: { code: "" },
  });

  const verifyMutation = useMutation({
    mutationFn: async (values: z.infer<typeof verifyCodeSchema>) => {
      console.log(values);
    },
    onSuccess: () => {
      toast.success("Code verified successfully!");
      onSuccess();
    },
    onError: (error) => {
      form.setError("code", {
        type: "manual",
        message:
          error instanceof Error ? error.message : "Invalid verification code",
      });
    },
  });

  const resendMutation = useMutation({
    mutationFn: async () => {
      await sendEmailRequest(email, url);
    },
    onSuccess: () => {
      toast.success("Reset email sent!");
      startTimer();
    },
    onError: () => {
      toast.error("Failed to resend email.");
    },
  });

  return (
    <Card className="h-auto w-full space-y-4 border-0 shadow-2xl">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-semibold">
          Check your email
        </CardTitle>
        <CardDescription>
          We sent a verification code to <strong>{email}</strong>. <br />
          If you haven&apos;t received an email within 5 minutes,{" "}
          <Link
            href={`https://mail.google.com/mail/u/${email}/#search/from:notifications@credlin.com`}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer font-bold"
          >
            check your spam
          </Link>{" "}
          folder or{" "}
          <button
            onClick={() => resendMutation.mutate()}
            disabled={isTimerActive || resendMutation.isPending}
            className="cursor-pointer text-blue-600 underline disabled:cursor-not-allowed disabled:opacity-50"
          >
            {resendMutation.isPending
              ? "Resending..."
              : isTimerActive
                ? `Request a new code in ${timeLeft}s`
                : "Request a new code"}
          </button>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) =>
              verifyMutation.mutate(values),
            )}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem className="mb-6 flex flex-col items-center justify-center">
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-1">
              <Button
                type="submit"
                className="h-12 w-full bg-blue-600 hover:bg-blue-700"
                disabled={verifyMutation.isPending}
              >
                {verifyMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Verify Code"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
