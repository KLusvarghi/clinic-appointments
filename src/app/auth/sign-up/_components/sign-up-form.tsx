"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { verifyEmail } from "@/actions/get-verify-email";
import { sendEmailRequest } from "@/client-actions/send-email";
import { PasswordRequirements } from "@/components/password-requirements";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  isPasswordValid,
  usePasswordValidation,
} from "@/hooks/use-password-validation";
import { authClient } from "@/lib/auth-client";

import { SocialLoginButton } from "../../_components/social-login-button";

const registerSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }),
  email: z.string().trim().email({ message: "Invalid email address" }),
  password: z
    .string()
    .trim()
    .min(8, { message: "Password must be at least 8 characters" }),
});


export function SignUpForm() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();
  const {
    passwordValidation,
    showPasswordValidation,
    handleChange: handlePasswordChange,
    handleFocus,
    handleBlur,
  } = usePasswordValidation();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof registerSchema>) => {
      const isAvaliableEmail = await verifyEmail({ email: values.email });
      if (isAvaliableEmail?.data) {
        toast.error("E-mail already registered");
        form.setError("email", {
          type: "manual",
          message: "E-mail already registered",
        });
        form.setFocus("email");
        throw new Error("E-mail already registered");
      }
      const response = await authClient.signUp.email({
        name: values.name,
        email: values.email,
        password: values.password,
      });

      if (!response.data) {
        throw new Error("Failed to create account");
      }
      setDialogOpen(true);
      return true;
    },
    onSuccess: async (_data, variables) => {
      const email = variables.email;
      await sendEmailRequest(email, "verify");
      console.log(_data);
      console.log(variables);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (values: z.infer<typeof registerSchema>) => {
    mutation.mutate(values);
  };

  const handleGoogle = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
      scopes: ["email", "profile"],
    });
  };


  return (
    <>
      <Card className="w-full border-0 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold">
            Create your account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="********"
                        {...field}
                        onChange={(e) =>
                          handlePasswordChange(e, field.onChange)
                        }
                        onFocus={() => handleFocus(field.value)}
                        onBlur={handleBlur}
                        aria-invalid={
                          !isPasswordValid(passwordValidation) && field.value
                            ? true
                            : undefined
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {showPasswordValidation &&
                !isPasswordValid(passwordValidation) && (
                  <PasswordRequirements validation={passwordValidation} />
                )}

              {/* {errors.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )} */}
              <Button
                type="submit"
                className="h-12 w-full bg-blue-600 hover:bg-blue-700"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating
                    account...
                  </>
                ) : (
                  "Create account"
                )}
              </Button>
            </form>
          </Form>
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
              text="Sign up with Google"
              onClick={handleGoogle}
            />
          </div>
        </CardContent>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">
            Already have an account?{" "}
          </span>
          <button
            onClick={() => redirect("/auth/sign-in")}
            className="cursor-pointer font-medium text-blue-600 hover:text-blue-700"
          >
            Sign in
          </button>
        </div>
      </Card>
      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            router.push("/dashboard");
          }
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Check your email</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground text-sm">
            We sent a verification link to your email. Please verify your
            account.
          </p>
          <DialogFooter>
            <Button
              onClick={() => setDialogOpen(false)}
              className="h-12 w-full bg-blue-600 hover:bg-blue-700"
            >
              Continue to dashboard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
