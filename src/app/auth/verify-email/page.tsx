"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter,useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { sendVerificationEmail } from "./_helpers/send-verification-email";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email");

  const mutation = useMutation({
    mutationFn: async () => {
      if (!email) throw new Error();
      await sendVerificationEmail(email);
    },
    onSuccess: () => {
      toast.success("Verification email sent");
    },
    onError: () => {
      toast.error("Failed to resend email.");
    },
  });

  return (
    <div className="flex w-screen items-center justify-center">
      <div className="w-[400px]">
        <Card className="h-auto w-full border-0 shadow-2xl">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl font-semibold">Check your email</CardTitle>
            <CardDescription>
              We sent a verification link to <strong>{email}</strong>. If you haven&apos;t received it,
              click the button below to resend.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              type="button"
              className="h-12 w-full bg-blue-600 hover:bg-blue-700"
              onClick={() => mutation.mutate()}
              disabled={mutation.isPending}
            >
              Resend email
            </Button>
            <Button
              type="button"
              className="h-12 w-full"
              variant="ghost"
              onClick={() => router.push("/auth/sign-in")}
            >
              Go back to login
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
