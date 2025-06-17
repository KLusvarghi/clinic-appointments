"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { updatePassword } from "@/actions/update-password";
import { PasswordRequirements } from "@/components/password-requirements";
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
import {
  isPasswordValid,
  usePasswordValidation,
} from "@/hooks/use-password-validation";

const formSchema = z.object({
  currentPassword: z.string().min(1, { message: "Required" }),
  newPassword: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

export default function PasswordForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { currentPassword: "", newPassword: "" },
  });

  const {
    passwordValidation,
    showPasswordValidation,
    handleChange: handlePasswordChange,
    handleFocus,
    handleBlur,
  } = usePasswordValidation();

  const action = useAction(updatePassword, {
    onSuccess: () => {
      toast.success("Password updated");
      form.reset();
    },
    onError: (err) => toast.error(err.message || "Error"),
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    action.execute(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  {...field}
                  onChange={(e) => handlePasswordChange(e, field.onChange)}
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
          disabled={action.isPending || !isPasswordValid(passwordValidation)}
        >
          {action.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Save
          changes
        </Button>
      </form>
    </Form>
  );
}
