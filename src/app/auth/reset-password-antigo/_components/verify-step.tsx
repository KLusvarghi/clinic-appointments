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
      const response = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code: values.code }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Invalid verification code");
      }
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
    <Card className="h-auto w-full border-0 shadow-2xl">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-semibold">
          Check your email
        </CardTitle>
        <CardDescription>
          We sent a verification code to <strong>{email}</strong>. <br />
          If you haven&apos;t received an email within 5 minutes, check your
          spam folder or{" "}
          <button
            onClick={() => resendMutation.mutate()}
            disabled={isTimerActive || resendMutation.isPending}
            className="cursor-pointer text-blue-600 underline disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isTimerActive
              ? `Request a new code in ${timeLeft}s`
              : "request that the message be resent"}
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
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter verification code"
                      {...field}
                    />
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
              <Button
                asChild
                type="button"
                className="h-12 w-full bg-blue-600 hover:bg-blue-700"
              >
                <Link
                  href={`https://mail.google.com/mail/u/${email}/#search/from:notifications@credlin.com`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open Gmail
                </Link>
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
          </form>
        </Form>
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
  );
}
