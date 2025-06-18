"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Building2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { updateClinic } from "@/actions/update-clinic";
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

const formSchema = z.object({
  name: z.string().trim().min(1, { message: "Clinic name is required" }),
});

export default function ClinicForm({
  defaultName,
}: {
  defaultName: string;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: defaultName },
  });

  const action = useAction(updateClinic);

  const savingState = useAutoSaveSetting(form.watch("name"), (v) =>
    action.executeAsync({ name: v }),
  );

  return (
    <Form {...form}>
      <form className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Clinic Name
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your clinic name"
                  {...field}
                  className="max-w-md"
                />
              </FormControl>
              <div className="flex items-center justify-between">
                <FormMessage />
                <div>
                  {savingState === "saving" && (
                    <p className="text-muted-foreground flex items-center gap-2 text-sm">
                      <div className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />
                      Saving...
                    </p>
                  )}
                  {savingState === "idle" && (
                    <p className="flex items-center gap-2 text-sm text-green-600">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      Saved
                    </p>
                  )}
                </div>
              </div>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
