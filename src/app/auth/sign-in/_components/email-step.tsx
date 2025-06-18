import { Loader2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { SocialLoginButton } from "../../_components/social-login-button";
import { EmailSchema } from "../_types/schema";

interface Props {
  form: UseFormReturn<EmailSchema>;
  isLoading: boolean;
  onSubmit: (values: EmailSchema) => void; // ← novo
  onGoogle: () => void;
  googleLoading: boolean;
}

// ui/EmailStep.tsx
export const EmailStep = ({
  form,
  isLoading,
  onGoogle,
  googleLoading,
  onSubmit,
}: Props) => (
  <>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="h-12 w-full bg-blue-600 hover:bg-blue-700"
          disabled={isLoading || googleLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...
            </>
          ) : (
            "Continue"
          )}
        </Button>
      </form>
    </Form>

    <div className="relative py-2">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className={cn("text-muted-foreground bg-card px-2")}>Or</span>
      </div>
    </div>
    <div className="space-y-3">
      <SocialLoginButton
        provider="google"
        text="Sign in with Google"
        onClick={onGoogle}
        isLoading={googleLoading}
        isVerifyEmail={isLoading}
      />
    </div>
  </>
);
