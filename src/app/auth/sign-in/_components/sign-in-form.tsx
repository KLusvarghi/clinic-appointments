"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { redirect, useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useGoogleMutation } from "../../_hooks/use-google-mutation";
import { useEmailMutation } from "../_hooks/use-email-mutation";
import { useEmailStep } from "../_hooks/use-email-step";
import { useLoginMutation } from "../_hooks/use-login-mutation";
import { emailSchema, loginSchema } from "../_types/schema";
import { EmailStep } from "./email-step";
import { PasswordStep } from "./password-step";

export function SignInForm() {
  const router = useRouter();
  const { step, toPassword, toEmail, setEmail } = useEmailStep();

  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  /** Mutations */
  const emailMut = useEmailMutation(
    () => {
      const enteredEmail = emailForm.getValues("email");
      loginForm.setValue("email", enteredEmail, { shouldValidate: false });
      setEmail(enteredEmail);
      toPassword();
    },
    // aqui eu defino o erro manualmente
    // passando o campo "email" o tipo e a mensagem que eu recebo do hook
    (msg) => emailForm.setError("email", { type: "manual", message: msg }),
  );

  const loginMut = useLoginMutation(
    () => {
      router.push("/dashboard");
    },
    (msg) => {
      loginForm.setError("password", { type: "manual", message: msg });
      loginForm.setValue("password", "");
      loginForm.setFocus("password");
    },
  );
  const googleMut = useGoogleMutation();

  return (
    <Card className="h-auto w-full border-0 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-semibold">
          Sign in to your account
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {step === "email" ? (
          <EmailStep
            form={emailForm}
            isLoading={emailMut.isPending}
            onSubmit={(values) => emailMut.mutate(values)}
            onGoogle={googleMut.mutate}
            googleLoading={googleMut.isPending}
          />
        ) : (
          <PasswordStep
            form={loginForm}
            isLoading={loginMut.isPending}
            onSubmit={(values) => loginMut.mutate(values)}
            onBack={() => {
              toEmail();
              emailForm.reset();
              loginForm.reset();
            }}
          />
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
