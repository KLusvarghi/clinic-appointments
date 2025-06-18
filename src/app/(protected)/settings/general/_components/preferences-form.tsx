"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Languages, Palette } from "lucide-react";
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
  defaultTheme?: "light" | "dark" | "system" | null;
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
      <form className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Languages className="h-4 w-4" />
                  Language
                </FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
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
                <FormLabel className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Theme
                </FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select theme" />
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
        </div>

        {/* Save Status */}
        <div className="flex items-center justify-end">
          {savingState === "saving" && (
            <p className="text-muted-foreground flex items-center gap-2 text-sm">
              <div className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />
              Saving preferences...
            </p>
          )}
          {savingState === "idle" && (
            <p className="flex items-center gap-2 text-sm text-green-600">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              Preferences saved
            </p>
          )}
        </div>
      </form>
    </Form>
  );
}
