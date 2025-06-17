"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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

export default function ClinicNameForm({
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
            <FormItem>
              <FormLabel>Clinic name</FormLabel>
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
      </form>
    </Form>
  );
}
