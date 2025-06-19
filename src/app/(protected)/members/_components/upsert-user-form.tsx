"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { upsertUser } from "@/actions/upsert-user";
import AvatarUpload from "@/components/ui/avatar-upload";
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
    }
  }, [isOpen, form, member]);

  const upsertUserAction = useAction(upsertUser, {
    onSuccess: () => {
      toast.success("User saved successfully");
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
      {/* Avatar Upload Section */}
      <div className="flex flex-col items-center space-y-4 sm:flex-row sm:items-start sm:space-y-0 sm:space-x-6 pt-4 pb-2">
        <AvatarUpload />
        <div className="text-center sm:text-left">
          <h3 className="text-sm font-medium">Profile Picture</h3>
          <p className="text-muted-foreground mt-1 text-sm">
            Upload a profile picture to personalize your account.
          </p>
        </div>
      </div>
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
