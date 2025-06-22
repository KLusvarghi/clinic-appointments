"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2, User } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { updateProfile } from "@/actions/update-profile";
import { clientGetAvatarUrlAction } from "@/client-actions/client-get-avatar-url";
import { sendEmailRequest } from "@/client-actions/send-email";
import { AvatarUpload } from "@/components/ui/avatar-upload";
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
import { useAvatarUploader } from "@/hooks/use-avatar-uploader";
import { AvatarUrlResponse } from "@/hooks/use-avatar-url";
import { useEmailVerified } from "@/hooks/use-email-verified";

interface ProfileFormProps {
  user: {
    id: string;
    name: string;
    email: string;
  };
}

const formSchema = z.object({
  name: z.string().trim().min(1, { message: "Clinic name is required" }),
});

export default function ClinicForm({ user }: ProfileFormProps) {
  const emailVerified = useEmailVerified();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: user.name },
  });

  const action = useAction(updateProfile);

  const resendMutation = useMutation({
    mutationFn: async () => {
      await sendEmailRequest(user.email, "verify-email");
    },
    onSuccess: () => toast.success("Verification email sent"),
    onError: () => toast.error("Failed to send verification email"),
  });

  const savingState = useAutoSaveSetting(form.watch("name"), async (v) => {
    const result = await action.executeAsync({ name: v });

    if (result?.serverError || result?.validationErrors) {
      toast.error("Failed to save changes");
    }
  });

  useEffect(() => {
    // form.reset({
    //   name: user?.name ?? "",
    // });
    const fetchAvatar = async () => {
      if (!user.id) return;
      try {
        const res: AvatarUrlResponse = await clientGetAvatarUrlAction({
          userId: user.id,
        });
        if (res?.data?.url) setAvatarUrl(res.data.url);
      } catch {
        setAvatarUrl(null);
      }
    };

    fetchAvatar();
  }, [user]);

  const uploadAvatarMutation = useAvatarUploader({
    onSuccess: (url) => {
      setAvatarUrl(url);
      toast.success("Avatar updated successfully");
    },
    onError: () => toast.error("Avatar upload failed"),
  });

  return (
    <div className="space-y-6">
      <AvatarUpload
        avatarFallback={user.name.slice(0, 1).toUpperCase()}
        previewUrl={avatarUrl}
        isUploading={uploadAvatarMutation.isPending}
        onUpload={(file) => {
          if (!user?.id) {
            toast.error("Missing user ID");
            return;
          }

          uploadAvatarMutation.mutate({
            file,
            ownerId: user.id,
            ownerType: "user",
            type: "user_avatar",
          });
        }}
      />

      {/* Form Section */}
      <Form {...form}>
        <form className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Full Name
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

          {/* Save Status */}
          <div className="flex items-center justify-between">
            <div>
              {savingState === "saving" && (
                <p className="text-muted-foreground flex items-center gap-2 text-sm">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />
                  Saving changes...
                </p>
              )}
              {savingState === "idle" && (
                <p className="flex items-center gap-2 text-sm text-green-600">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  All changes saved
                </p>
              )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
