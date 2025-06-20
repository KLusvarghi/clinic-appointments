"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { CircleUserRoundIcon, Loader2, User, XIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { updateProfile } from "@/actions/update-profile";
import { sendEmailRequest } from "@/client-actions/send-email";
import { uploadAvatar } from "@/client-actions/upload-avatar";
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
import { useFileUpload } from "@/hooks/use-file-upload";

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

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/user/avatar")
      .then((res) => (res.ok ? res.json() : { url: null }))
      .then((data) => setAvatarUrl(data.url ?? null))
      .catch(() => setAvatarUrl(null));
  }, []);

  const [
    { files, isDragging },
    {
      removeFile,
      openFileDialog,
      getInputProps,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      clearFiles,
    },
  ] = useFileUpload({ maxSize: 5 * 1024 * 1024, accept: "image/*" });

  const file = files[0]?.file instanceof File ? (files[0].file as File) : null;
  const previewUrl = files[0]?.preview || avatarUrl || null;

  const uploadAvatarMutation = useMutation({
    mutationFn: async () => {
      if (!file) throw new Error("No file selected");
      return uploadAvatar(file);
    },
    onSuccess: (data) => {
      setAvatarUrl(data.url);
      clearFiles();
      toast.success("Avatar updated successfully");
    },
    onError: () => toast.error("Upload failed. Try again."),
  });

  return (
    <div className="space-y-6">
      {/* Avatar Upload Section */}
      <div className="flex flex-col items-center space-y-4 sm:flex-row sm:items-start sm:space-y-0 sm:space-x-6">
        <div className="flex flex-col items-center gap-2">
          <div className="relative inline-flex">
            <button
              className="border-input hover:bg-accent/50 data-[dragging=true]:bg-accent/50 focus-visible:border-ring focus-visible:ring-ring/50 relative flex size-16 items-center justify-center overflow-hidden rounded-full border border-dashed transition-colors outline-none focus-visible:ring-[3px] has-disabled:pointer-events-none has-disabled:opacity-50 has-[img]:border-none"
              onClick={openFileDialog}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              data-dragging={isDragging || undefined}
              aria-label={previewUrl ? "Change image" : "Upload image"}
            >
              {previewUrl ? (
                <img
                  className="size-full object-cover"
                  src={previewUrl}
                  alt="Avatar preview"
                  width={64}
                  height={64}
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <div aria-hidden="true">
                  <CircleUserRoundIcon className="size-4 opacity-60" />
                </div>
              )}
            </button>
            {files.length > 0 && (
              <Button
                onClick={() => removeFile(files[0]?.id)}
                size="icon"
                className="border-background focus-visible:border-background absolute -top-1 -right-1 size-6 rounded-full border-2 shadow-none"
                aria-label="Remove image"
              >
                <XIcon className="size-3.5" />
              </Button>
            )}
            <input
              {...getInputProps()}
              className="sr-only"
              aria-label="Upload image file"
              tabIndex={-1}
            />
          </div>
          {files.length > 0 && (
            <Button
              type="button"
              size="sm"
              onClick={() => uploadAvatarMutation.mutate()}
              disabled={uploadAvatarMutation.isPending}
            >
              {uploadAvatarMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save
            </Button>
          )}
        </div>
        <div className="text-center sm:text-left">
          <h3 className="text-sm font-medium">Profile Picture</h3>
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
