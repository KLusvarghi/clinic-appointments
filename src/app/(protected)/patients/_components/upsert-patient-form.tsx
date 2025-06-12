"use-client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { PatternFormat } from "react-number-format";
import { toast } from "sonner";
import { z } from "zod";

// import { deletePatient } from "@/actions/delete-patient";
import { upsertPatient } from "@/actions/upsert-patient";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
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
import { patientsTable } from "@/db/schema/schema";

const formSchema = z.object({
  name: z.string().trim().min(1, {
    message: "Name is required",
  }),
  email: z.string().email({
    message: "Email is invalid",
  }),
  phoneNumber: z.string().trim().min(1, {
    message: "Phone number is required",
  }),
  sex: z.enum(["male", "female"], {
    required_error: "Sex is required.",
  }),
});

interface UpsertPatientFormProps {
  isOpen: boolean;
  patient?: typeof patientsTable.$inferSelect;
  onSuccess?: () => void;
}

export function UpsertPatientForm({
  isOpen,
  patient,
  onSuccess,
}: UpsertPatientFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    shouldUnregister: true,
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: patient?.name ?? "",
      email: patient?.email ?? "",
      phoneNumber: patient?.phoneNumber ?? "",
      sex: patient?.sex ?? undefined,
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset(patient);
    }
  }, [isOpen, form, patient]);

  const upsertPatientAction = useAction(upsertPatient, {
    onSuccess: () => {
      toast.success("Patient saved successfully");
      form.reset();
      onSuccess?.();
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    upsertPatientAction.execute({
      ...values,
      id: patient?.id,
    });
  };

  return (
    <DialogContent>
      <DialogHeader>{patient ? patient.name : "Add a patient"}</DialogHeader>
      <DialogDescription>
        {patient
          ? "Edit the information of the patient"
          : "Add a new patient to your clinic."}
      </DialogDescription>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <PatternFormat
                    format="(##) #####-####"
                    customInput={Input}
                    value={field.value}
                    onValueChange={(values) => {
                      field.onChange(values.value);
                    }}
                    placeholder="(11) 99999-9999"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sex"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sex</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sex" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter>
            <Button
              type="submit"
              disabled={upsertPatientAction.isPending}
              className="w-full"
            >
              {upsertPatientAction.isPending ? (
                <>
                  <Loader2 className="mr-2 w-4 animate-spin" />
                  {patient ? "Updating patient..." : "Adding patient..."}
                </>
              ) : patient ? (
                "Save changes"
              ) : (
                "Add patient"
              )}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
