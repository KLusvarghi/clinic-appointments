"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { updateClinic } from "@/actions/update-clinic";
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

const formSchema = z.object({
  name: z.string().trim().min(1, { message: "Clinic name is required" }),
});

export default function ClinicNameForm({ defaultName }: { defaultName: string }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: defaultName },
  });

  const action = useAction(updateClinic, {
    onSuccess: () => toast.success("Clinic updated"),
    onError: () => toast.error("Failed to update clinic"),
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    action.execute(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Clinic name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={action.isPending}>
          {action.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Save
          changes
        </Button>
      </form>
    </Form>
  );
}
