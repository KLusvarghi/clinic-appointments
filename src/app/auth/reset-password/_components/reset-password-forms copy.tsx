import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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

const emailSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }),
});

interface ResetPasswordFormsProps {
  userEmail?: string | null;
}

export function ResetPasswordForms({ userEmail }: ResetPasswordFormsProps) {
  const emailToShow = userEmail ?? "";
  const router = useRouter();

  const [step, setStep] = useState<"email" | "verify-email" | "resend-email">(
    "email",
  );
  const [email, setEmail] = useState("");

  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  useEffect(() => {
    emailForm.setValue("email", emailToShow);
  }, [emailToShow]);

  const emailMutation = useMutation({
    mutationFn: async (values: z.infer<typeof emailSchema>) => {
      const result = await handleSendEmail();
      console.log(values);
      if (result.ok) {
        toast.success("E-mail reenviado com sucesso.");
        return true;
      } else {
        toast.error("Não foi possível reenviar o e-mail.");
        throw new Error("Não foi possível reenviar o e-mail.");
      }
    },
    onSuccess: () => {
      setEmail(emailForm.getValues("email"));
      setStep("verify-email");
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.message);
    },
  });

  const onEmailSubmit = (values: z.infer<typeof emailSchema>) => {
    emailMutation.mutate(values);
  };

  const handleSendEmail = async () => {
    // action ou api que faz o envio do email
    // aqui ou eu passo o valor no body ou na url (ver o que pé melhor)
    const res = await fetch("/api/email/reset-password", {
      method: "POST",
    });

    return res;
  };

  const formsText = {
    email: {
      title: "Reset your password",
      description:
        "Enter the email associated with your account to receive a password reset link.",
    },
    "verify-email": {
      title: "Verifique seu e-mail",
      description: `If ${userEmail} matches a registered address, you will receive an email with password reset instructions.<br/> If you haven't received an email within 5 minutes, check your spam folder, 
      <button className="cursor-pointer" onClick={() => setStep("resend-email")}>request that the message be resent</button className="cursor-pointer">, or try using another email address.`,
    },
    "resend-email": {
      title: "Verifique seu e-mail",
      description: `If the email is registered, we will resend the password reset instructions to ${userEmail}. <br/> Please check again. If you still haven't received the message, try using a different email address.`,
    },
  };

  return (
    <Card className="h-auto w-full border-0 shadow-2xl">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-semibold">
          {step === "email"
            ? formsText.email.title
            : step === "verify-email"
              ? formsText["verify-email"].title
              : formsText["resend-email"].title}
        </CardTitle>
        <CardDescription>
          {step === "email"
            ? formsText.email.description
            : step === "verify-email"
              ? formsText["verify-email"].description
              : formsText["resend-email"].description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
                      // value={userEmail}
                      placeholder="you@examsple.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-1">
              {step === "email" ? (
                <Button
                  type="submit"
                  className="h-12 w-full bg-blue-600 hover:bg-blue-700"
                  disabled={emailMutation.isPending}
                >
                  {emailMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    "Continue"
                  )}
                </Button>
              ) : (
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
              )}
              <Button
                type="button"
                className="h-12 w-full"
                disabled={emailMutation.isPending}
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
    // <div className="mx-auto mt-16 max-w-md text-center">
    //   <h1 className="text-2xl font-semibold">Verifique seu e-mail</h1>
    //   <p className="felx mt-4 flex-col justify-center text-gray-600">
    //     Enviamos um link para o seu e-mail{" "}
    //     <span className="bg-border flex justify-center rounded-md px-2 py-2 font-bold">
    //       {email}
    //     </span>
    //     . Verifique sua caixa de entrada ou spam.
    //   </p>

    //   <button
    //     onClick={handleResend}
    //     disabled={!canResend}
    //     // className="mt-6 rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
    //     className={classNames(
    //       "mt-6 rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50",
    //       {
    //         ["cursor-not-allowed"]: !canResend,
    //       },
    //     )}
    //   >
    //     {canResend
    //       ? "Reenviar e-mail de verificação"
    //       : `Aguarde ${formatTime(count)}`}
    //   </button>
    // </div>
  );
}
