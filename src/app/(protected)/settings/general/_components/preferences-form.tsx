"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { updatePreferences } from "@/actions/update-preferences";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAutoSaveSetting } from "@/hooks/use-auto-save-setting";

const formSchema = z.object({
  language: z.string().optional(),
  theme: z.enum(["light", "dark", "system"]),
});

interface PreferencesFormProps {
  defaultLanguage?: string | null;
  defaultTheme: "light" | "dark" | "system" | null;
}

export default function PreferencesForm({
  defaultLanguage,
  defaultTheme,
}: PreferencesFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      language: defaultLanguage ?? "en",
      theme: defaultTheme ?? "system",
    },
  });

  const { setTheme } = useTheme();

  const action = useAction(updatePreferences);

  const values = form.watch();
  const savingState = useAutoSaveSetting(values, (v) => action.executeAsync(v));
  useEffect(() => {
    setTheme(values.theme);
  }, [values.theme, setTheme]);

  return (
    <Form {...form}>
      <form className="space-y-4">
        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Language</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="pt">Portuguese</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="theme"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Theme</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {savingState === "saving" && (
          <p className="text-muted-foreground text-xs">Saving…</p>
        )}
        {savingState === "idle" && (
          <p className="text-xs text-green-600">Saved</p>
        )}
      </form>
    </Form>
  );
}
