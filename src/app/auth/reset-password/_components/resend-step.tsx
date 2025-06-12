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

interface ResendStepFormsProps {
  email?: string | null;
}

export function ResendStep({ email }: ResendStepFormsProps) {
  const router = useRouter();

  return (
    <Card className="h-auto w-full border-0 shadow-2xl">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-semibold">
          Check your email
        </CardTitle>
        <CardDescription>
          If the email is registered, we will resend the password reset
          instructions to <strong>{email}</strong>. <br />
          Please check again. If you still haven&apos;t received the message,
          try using a different email address.
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
            className="h-12 w-full"
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
  );
}
