"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { updateProfile } from "@/actions/update-profile";
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
import { useAutoSaveSetting } from "@/hooks/use-auto-save-setting";
import { useEmailVerified } from "@/hooks/use-email-verified";

interface ProfileFormProps {
  user: {
    name: string;
    email: string;
  };
}

const formSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }),
});

export default function ProfileForm({ user }: ProfileFormProps) {
  const emailVerified = useEmailVerified();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: user.name },
  });

  const updateAction = useAction(updateProfile);

  const resendMutation = useMutation({
    mutationFn: async () => {
      // await sendEmail(user.email);
    },
    onSuccess: () => toast.success("Verification email sent"),
    onError: () => toast.error("Failed to send verification email"),
  });

  const savingState = useAutoSaveSetting(form.watch("name"), (v) =>
    updateAction.executeAsync({ name: v }),
  );

  return (
    <Form {...form}>
      <form className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              {savingState === "saving" && (
                <p className="text-muted-foreground text-xs">Saving…</p>
              )}
              {savingState === "idle" && (
                <p className="text-xs text-green-600">Saved</p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <p className="text-sm">
            Email: <strong>{user.email}</strong>
          </p>
          {emailVerified ? (
            <p className="text-sm text-green-600">Email verified</p>
          ) : (
            <div className="flex items-center gap-2">
              <p className="text-sm text-yellow-600">Email not verified</p>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => resendMutation.mutate()}
                disabled={resendMutation.isPending}
              >
                {resendMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Resend verification
              </Button>
            </div>
          )}
        </div>
      </form>
    </Form>
  );
}
