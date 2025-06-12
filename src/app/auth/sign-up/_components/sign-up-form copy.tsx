"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Check, Loader2, X } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { authClient } from "@/lib/auth-client";
import { signUp } from "@/services/auth";

import { SocialLoginButton } from "../../_components/social-login-button";

const registerSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }),
  email: z.string().trim().email({ message: "Invalid email address" }),
  password: z
    .string()
    .trim()
    .min(8, { message: "Password must be at least 8 characters" }),
});

// Password validation type and function
type PasswordValidation = {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
};

function validatePassword(password: string): PasswordValidation {
  return {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };
}

function isPasswordValid(validation: PasswordValidation) {
  return Object.values(validation).every(Boolean);
}

export function SignUpForm() {
  const router = useRouter();
  const [passwordValidation, setPasswordValidation] =
    useState<PasswordValidation>({
      minLength: false,
      hasUppercase: false,
      hasLowercase: false,
      hasNumber: false,
      hasSpecialChar: false,
    });
  const [showPasswordValidation, setShowPasswordValidation] = useState(false);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof registerSchema>) =>
      signUp({
        name: values.name,
        email: values.email,
        password: values.password,
      }),
    onSuccess: () => {
      router.push("/dashboard");
    },
    onError: (ctx: { error?: { code?: string } }) => {
      if (ctx?.error?.code === "USER_ALREADY_EXISTS") {
        toast.error("E-mail already registered");
      } else {
        toast.error("Failed to create account");
      }
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

  const handlePasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldOnChange: (value: string) => void,
  ) => {
    const value = e.target.value;
    fieldOnChange(value);
    const validation = validatePassword(value);
    setPasswordValidation(validation);
    setShowPasswordValidation(value.length > 0);
  };

  return (
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
                  <Popover open={showPasswordValidation}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="********"
                          {...field}
                          onChange={(e) =>
                            handlePasswordChange(e, field.onChange)
                          }
                          onFocus={() =>
                            setShowPasswordValidation(!!field.value)
                          }
                          onBlur={() => setShowPasswordValidation(false)}
                          aria-invalid={
                            !isPasswordValid(passwordValidation) && field.value
                              ? true
                              : undefined
                          }
                        />
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      side="right"
                      align="start"
                      className="w-80 p-4"
                    >
                      <div className="text-sm text-gray-600">
                        <p className="mb-2">Your password must contain:</p>
                        <div className="space-y-1">
                          <div
                            className={`flex items-center ${passwordValidation.minLength ? "text-green-600" : "text-gray-500"}`}
                          >
                            {passwordValidation.minLength ? (
                              <Check className="mr-2 h-3 w-3" />
                            ) : (
                              <X className="mr-2 h-3 w-3" />
                            )}
                            8 or more characters
                          </div>
                          <div
                            className={`flex items-center ${passwordValidation.hasUppercase ? "text-green-600" : "text-gray-500"}`}
                          >
                            {passwordValidation.hasUppercase ? (
                              <Check className="mr-2 h-3 w-3" />
                            ) : (
                              <X className="mr-2 h-3 w-3" />
                            )}
                            Uppercase letter
                          </div>
                          <div
                            className={`flex items-center ${passwordValidation.hasLowercase ? "text-green-600" : "text-gray-500"}`}
                          >
                            {passwordValidation.hasLowercase ? (
                              <Check className="mr-2 h-3 w-3" />
                            ) : (
                              <X className="mr-2 h-3 w-3" />
                            )}
                            Lowercase letter
                          </div>
                          <div
                            className={`flex items-center ${passwordValidation.hasNumber ? "text-green-600" : "text-gray-500"}`}
                          >
                            {passwordValidation.hasNumber ? (
                              <Check className="mr-2 h-3 w-3" />
                            ) : (
                              <X className="mr-2 h-3 w-3" />
                            )}
                            Number
                          </div>
                          <div
                            className={`flex items-center ${passwordValidation.hasSpecialChar ? "text-green-600" : "text-gray-500"}`}
                          >
                            {passwordValidation.hasSpecialChar ? (
                              <Check className="mr-2 h-3 w-3" />
                            ) : (
                              <X className="mr-2 h-3 w-3" />
                            )}
                            Special character
                          </div>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
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
        <span className="text-muted-foreground">Already have an account? </span>
        <button
          onClick={() => redirect("/auth/sign-in")}
          className="cursor-pointer font-medium text-blue-600 hover:text-blue-700"
        >
          Sign in
        </button>
      </div>
    </Card>
  );
}
