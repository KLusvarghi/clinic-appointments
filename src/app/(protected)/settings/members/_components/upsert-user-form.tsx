"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { startTransition, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { upsertUser } from "@/actions/upsert-user";
import { clientGetAvatarUrlAction } from "@/client-actions/client-get-avatar-url";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { userRoleEnum } from "@/db/schema";
import { useAvatarUploader } from "@/hooks/use-avatar-uploader";
import { AvatarUrlResponse } from "@/hooks/use-avatar-url";

import { AvatarUpload } from "../../../_components/avatar-upload";
import { Member } from "../_types";

const formSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Email is invalid" }),
  role: z.enum(userRoleEnum.enumValues),
});

interface UpsertUserFormProps {
  isOpen: boolean;
  member?: Member | null;
  onSuccess?: () => void;
}

export default function UpsertUserForm({
  isOpen,
  member,
  onSuccess,
}: UpsertUserFormProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    shouldUnregister: true,
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: member?.user?.name ?? "",
      email: member?.user?.email ?? "",
      role: member?.role ?? "MANAGER",
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: member?.user?.name ?? "",
        email: member?.user?.email ?? "",
        role: member?.role ?? "MANAGER",
      });
      const fetchAvatar = async () => {
        if (!member?.user.id) return;
        try {
          const res: AvatarUrlResponse = await clientGetAvatarUrlAction({
            userId: member.user.id,
          });
          if (res?.data?.url) setAvatarUrl(res.data.url);
        } catch {
          setAvatarUrl(null);
        }
      };

      fetchAvatar();
    }
  }, [isOpen, form, member]);

  const uploadAvatarMutation = useAvatarUploader({
    onSuccess: (url) => {
      setAvatarUrl(url);
      toast.success("Avatar updated successfully");
    },
    onError: () => toast.error("Avatar upload failed"),
  });

  const upsertUserAction = useAction(upsertUser, {
    onSuccess: () => {
      toast.success("User saved successfully");
      startTransition(() => router.refresh()); // <── força rerender do Server Component
      form.reset();
      onSuccess?.();
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    upsertUserAction.execute({
      ...values,
      id: member?.user?.id,
    });
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{member ? "Edit user" : "Add a user"}</DialogTitle>
        <DialogDescription>
          {member
            ? "Edit the information of the user"
            : "Add a new collaborator to your clinic."}
        </DialogDescription>
      </DialogHeader>
      <AvatarUpload
        previewUrl={avatarUrl}
        isUploading={uploadAvatarMutation.isPending}
        onUpload={(file) => {
          if (!member?.user?.id) {
            toast.error("Missing user ID");
            return;
          }

          uploadAvatarMutation.mutate({
            file,
            ownerId: member.user.id,
            ownerType: "user",
            type: "user_avatar",
          });
        }}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
                    placeholder="john@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {userRoleEnum.enumValues.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onSuccess?.()}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={upsertUserAction.isPending}
              // className="w-full"
            >
              {upsertUserAction.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {member ? "Updating user..." : "Adding user..."}
                </>
              ) : member ? (
                "Save changes"
              ) : (
                "Add user"
              )}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
