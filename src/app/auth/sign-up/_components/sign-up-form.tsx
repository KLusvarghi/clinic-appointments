"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { cn } from "@/lib/utils";

import { SocialLoginButton } from "../../_components/social-login-button";
import { useGoogleMutation } from "../../_hooks/use-google-mutation";
import { useRegisterMutation } from "../_hooks/use-register-mutation";
import { registerSchema } from "../_types/schema";

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

  const registerMut = useRegisterMutation(
    () => setDialogOpen(true),
    (msg) => form.setError("email", { type: "manual", message: msg }),
  );

  const googleMut = useGoogleMutation();

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
            <form
              onSubmit={form.handleSubmit((values) =>
                registerMut.mutate(values),
              )}
              className="space-y-4"
            >
              {/* Name */}
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
              {/* Email */}
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
              {/* Password */}
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

              <Button
                type="submit"
                className="h-12 w-full bg-blue-600 hover:bg-blue-700"
                disabled={registerMut.isPending}
              >
                {registerMut.isPending ? (
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
          {/* Divider + Google */}

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className={cn("text-muted-foreground bg-card px-2")}>
                Or
              </span>
            </div>
          </div>
          <div className="space-y-3">
            <SocialLoginButton
              provider="google"
              text="Sign up with Google"
              onClick={googleMut.mutate}
              isLoading={googleMut.isPending}
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
