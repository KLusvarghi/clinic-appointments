"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { createClinic } from "@/actions/create-clinic";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const clinicFormSchema = z.object({
  name: z.string().trim().min(1, { message: "Clinic name is required" }),
});

const ClinicForm = () => {
  const form = useForm<z.infer<typeof clinicFormSchema>>({
    resolver: zodResolver(clinicFormSchema),
    defaultValues: {
      name: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof clinicFormSchema>) => {
    try {
      // e para chamar a server action, basta:
      await createClinic(data.name);
    } catch (error) {
      // como no nosso server component, temos o redirect, temos que tratar isso aqui, já que ele gerá um erro que não é um erro de servidor, mas sim um erro de redirect:
      if (isRedirectError(error)) {
        return;
      }
      console.log(error);
      toast.error("Error creating clinic");
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
          <DialogFooter>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 w-4 animate-spin" /> Creating clinic...
                </>
              ) : (
                "Create clinic"
              )}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
};

export default ClinicForm;
