"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2, User } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { updateProfile } from "@/actions/update-profile";
import { sendEmailRequest } from "@/client-actions/send-email";
import AvatarUpload from "@/components/ui/avatar-upload";
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
import { useFileUpload } from "@/components/ui/use-file-upload";
import { useAutoSaveSetting } from "@/hooks/use-auto-save-setting";
import { useEmailVerified } from "@/hooks/use-email-verified";
import { uploadToS3 } from "@/lib/s3/upload-to-s3";
import { createAssetFromUrl } from "@/lib/upload/create-asset-from-url";

interface ProfileFormProps {
  user: {
    name: string;
    email: string;
  };
}

const formSchema = z.object({
  name: z.string().trim().min(1, { message: "Clinic name is required" }),
});

export default function ClinicForm({ user }: ProfileFormProps) {
  const emailVerified = useEmailVerified();

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

  const savingState = useAutoSaveSetting(form.watch("name"), (v) =>
    action.executeAsync({ name: v }),
  );

  const { file, preview, inputProps, reset } = useFileUpload({
    maxSize: 5 * 1024 * 1024, // 5MB
    accept: { "image/*": [] },
  });

  const uploadAvatar = useMutation({
    mutationFn: async () => {
      if (!file) throw new Error("No file selected");

      const { url, key } = await uploadToS3(file);
      const asset = await createAssetFromUrl(url, file);
      // TODO: Atualizar perfil com avatarId ou url, como preferir
      toast.success("Avatar updated successfully!");
      return asset;
    },
    onSuccess: () => reset(),
    onError: () => toast.error("Upload failed. Try again."),
  });

  return (
    <div className="space-y-6">
      {/* Avatar Upload Section */}
      <div className="flex flex-col items-center space-y-4 sm:flex-row sm:items-start sm:space-y-0 sm:space-x-6">
        <div className="flex flex-col items-center">
          <AvatarUpload
            preview={preview}
            inputProps={inputProps}
            onClear={reset}
            onSave={uploadAvatar.mutate}
            loading={uploadAvatar.isPending}
          />
          <p className="text-muted-foreground mt-1 text-sm">
            Upload a profile picture to personalize your account.
          </p>
        </div>
      </div>

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
