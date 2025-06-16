"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { verifyEmail } from "@/actions/get-verify-email";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

// import { signIn } from "@/services/auth";
import { SocialLoginButton } from "../../_components/social-login-button";

const emailSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }),
});

const loginSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }),
  password: z
    .string()
    .trim()
    .min(8, { message: "Password must be at least 8 characters" }),
});

export function SignInForm() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "password">("email");
  const [email, setEmail] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  // Update form values when email changes
  useEffect(() => {
    if (email) {
      loginForm.setValue("email", email);
    }
  }, [email, loginForm]);

  const emailMutation = useMutation({
    mutationFn: async (values: z.infer<typeof emailSchema>) => {
      const isAvaliableEmail = await verifyEmail({ email: values.email });
      if (isAvaliableEmail?.serverError) {
        throw new Error("Email not found. Please sign up first.");
      }
      const provider = isAvaliableEmail?.data?.provider;
      if (provider !== "credential") {
        emailForm.setError("email", {
          type: "manual",
          message: `This Email has been created with ${provider}. Sign in with the same provider.`,
        });
        emailForm.setFocus("email");
        throw new Error(
          `This Email has been created with ${provider}. Sign in with the same provider.`,
        );
      }
      return true;
    },
    onSuccess: () => {
      setEmail(emailForm.getValues("email"));
      setStep("password");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (values: z.infer<typeof loginSchema>) => {
      const response = await authClient.signIn.email({
        email: values.email,
        password: values.password,
        rememberMe,
      });
      if (!response?.data?.user) {
        throw new Error("Authentication failed");
      }
      return response;
    },
    onSuccess: (data) => {
      if (data?.data.user) {
        router.push("/dashboard");
      }
    },
    onError: () => {
      toast.error("Invalid email or password");
    },
  });

  const googleMutation = useMutation({
    mutationFn: async () => {
      const response = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
        scopes: ["email", "profile"],
      });
      if (!response?.data?.redirect) {
        throw new Error("Authentication failed");
      }
      return response;
    },
    onError: () => {
      toast.error("Invalid email or password");
    },
  });

  const onEmailSubmit = (values: z.infer<typeof emailSchema>) => {
    emailMutation.mutate(values);
  };

  const onLoginSubmit = (values: z.infer<typeof loginSchema>) => {
    loginMutation.mutate(values);
  };
  
  const handleGoogle = async () => {
    googleMutation.mutate();
  };

  const handleBackToEmail = () => {
    setStep("email");
    setEmail("");
    loginForm.reset();
    emailForm.reset();
  };

  return (
    <Card className="h-auto w-full border-0 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-semibold">
          Sign in to your account
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {step === "email" ? (
          <Form {...emailForm}>
            <form
              onSubmit={emailForm.handleSubmit(onEmailSubmit)}
              className="space-y-4"
            >
              <FormField
                control={emailForm.control}
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
              <Button
                type="submit"
                className="h-12 w-full bg-blue-600 hover:bg-blue-700"
                disabled={emailMutation.isPending}
              >
                {emailMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Verifying...
                  </>
                ) : (
                  "Continue"
                )}
              </Button>
            </form>
          </Form>
        ) : (
          <Form {...loginForm}>
            <form
              onSubmit={loginForm.handleSubmit(onLoginSubmit)}
              className="space-y-4"
            >
              {/* <Button
                type="button"
                variant="ghost"
                onClick={handleBackToEmail}
                className="h-auto items-start p-0 font-normal text-blue-600 hover:text-blue-700"
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back
              </Button> */}

              <FormField
                control={loginForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        {...field}
                        value={email}
                        disabled
                        className="bg-gray-50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="********"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center space-x-2">
                <input
                  id="rememberMe"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="rememberMe" className="text-sm">
                  Remember me
                </label>
              </div>
              <div className="flex w-full justify-end">
                <button
                  type="button"
                  onClick={() => {
                    redirect(
                      `/auth/reset-password?email=${encodeURIComponent(email)}`,
                    );
                  }}
                  className="cursor-pointer text-sm text-blue-600 hover:text-blue-700"
                >
                  Forgot your password?
                </button>
              </div>
              <div className="space-y-2">
                <Button
                  type="submit"
                  className="h-12 w-full bg-blue-600 hover:bg-blue-700"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing
                      in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </Button>
                <Button
                  type="button"
                  className="h-12 w-full text-blue-600"
                  disabled={loginMutation.isPending}
                  onClick={handleBackToEmail}
                  variant="ghost"
                >
                  Go back
                </Button>
              </div>
            </form>
          </Form>
        )}

        {step === "email" && (
          <>
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="text-muted-foreground bg-white px-2">Or</span>
              </div>
            </div>
            <div className="space-y-3">
              <SocialLoginButton
                provider="google"
                text="Sign in with Google"
                onClick={handleGoogle}
                isLoading={googleMutation.isPending}
              />
            </div>
          </>
        )}
      </CardContent>
      <div className="text-center text-sm">
        <span className="text-muted-foreground">New to Credlin? </span>
        <button
          onClick={() => redirect("/auth/sign-up")}
          className="cursor-pointer font-medium text-blue-600 hover:text-blue-700"
        >
          Create account
        </button>
      </div>
    </Card>
  );
}
