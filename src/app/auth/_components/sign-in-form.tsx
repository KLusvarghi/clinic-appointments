"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import GoogleIcon from "@/components/icons/google";
import LinkedinIcon from "@/components/icons/linkedin";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { authClient } from "@/lib/auth-client";

// import { GoogleSignInButton } from "./GoogleSignInButton";

const loginSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }),
  password: z
    .string()
    .trim()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

const SignInForm = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  const handleSubmit = async (values: z.infer<typeof loginSchema>) => {
    await authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
      },
      {
        onSuccess: async () => {
          toast.success("Conta criada com sucesso, verifique seu e-mail");
          const res = await fetch("/api/email/resend-verification", {
            method: "POST",
          });
          if (res.ok) {
            router.push("/auth/verify-pending");
          } else {
            toast.error("Não foi possível reenviar o e-mail.");
          }
        },
        onError: () => {
          toast.error("Email ou senha inválidos");
        },
      },
    );
  };

  const handleGoogleSignIn = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard", // fará com que redirecione para dashboard
      scopes: ["email", "profile"], // isso é para pegar o email e o perfil do usuário
    });
    // try {
    //   const res = await fetch("/api/auth/sign-in", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({
    //       email: values.email,
    //       password: values.password,
    //     }),
    //   });

    //   if (res.ok) {
    //     router.push("/dashboard");
    //   } else {
    //     const error = await res.json();
    //     toast.error(error?.error || "Erro ao entrar");
    //   }
    // } catch {
    //   toast.error("Erro de rede");
    // }
  };

  const handleLinkedinSignIn = async () => {
    await authClient.signIn.social({
      provider: "linkedin",
      callbackURL: "/dashboard", // fará com que redirecione para dashboard
      scopes: ["email", "profile"], // isso é para pegar o email e o perfil do usuário
    });
  };

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Login to access your account here.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input placeholder="kaua@gmail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="********" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <Link href="/auth/verify-pending">Verifique seu e-mail</Link> */}
          </CardContent>
          <CardFooter>
            <div className="w-full space-y-2">
              <Button className="w-full" type="submit">
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 w-4 animate-spin" />
                    Accessing account...
                  </>
                ) : (
                  "Access my account"
                )}
              </Button>
              <Button
                className="w-full"
                variant="outline"
                onClick={handleGoogleSignIn}
                type="button"
              >
                <GoogleIcon />
                Sign in with Google
              </Button>
              {/* <GoogleSignInButton /> */}
              <Button
                className="w-full"
                variant="outline"
                onClick={handleLinkedinSignIn}
                type="button"
              >
                <LinkedinIcon />
                Sign in with Linkedin
              </Button>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default SignInForm;
