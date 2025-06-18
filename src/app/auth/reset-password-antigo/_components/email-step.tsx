"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { verifyEmail } from "@/actions/get-verify-email";
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

import { StepType } from "../_types";

const emailSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }),
});

interface EmailStepProps {
  email: string | null;
  setEmail: (email: string) => void;
  setStep: (step: StepType) => void;
  url: string;
}

export function EmailStep({ email, setEmail, setStep, url }: EmailStepProps) {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: email ?? "" },
  });

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof emailSchema>) => {
      const isAvaliableEmail = await verifyEmail({ email: data.email });

      if (isAvaliableEmail?.serverError) {
        throw new Error("Email not found. Please sign up first.");
      }
      const provider = isAvaliableEmail?.data?.provider;
      if (provider !== "credential") {
        throw new Error(
          `This Email has been created with ${provider}. Try to sign in with the same provider.`,
        );
      }
      await sendEmailRequest(data.email, url);
    },
    onSuccess: () => {
      const submittedEmail = form.getValues("email");
      setEmail(submittedEmail);
      setStep("verify-email");
      toast.success("Reset email sent!");
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to send email.");
    },
  });

  return (
    <Card className="h-auto w-full border-0 shadow-2xl">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-semibold">
          Reset your password
        </CardTitle>
        <CardDescription>
          Enter the email associated with your account to receive a password
          reset link.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
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
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Continue"
                )}
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
