"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { doctorsTable, patientsTable } from "@/db/schema";
import { useEmailVerified } from "@/hooks/use-email-verified";

import { AddAppointmentForm } from "./add-appointment-form";

interface AddAppointmentButtonProps {
  patients: (typeof patientsTable.$inferSelect)[];
  doctors: (typeof doctorsTable.$inferSelect)[];
}

const AddAppointmentButton = ({
  patients,
  doctors,
}: AddAppointmentButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const emailVerified = useEmailVerified();

  const handleOpenChange = (open: boolean) => {
    if (open && !emailVerified) {
      toast.error("Verify your email to add an appointment");
      return;
    }
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button disabled={!emailVerified}>
          <Plus />
          Add new Appointment
        </Button>
      </DialogTrigger>
      <AddAppointmentForm
        isOpen={isOpen}
        patients={patients}
        doctors={doctors}
        onSuccess={() => setIsOpen(false)}
      />
    </Dialog>
  );
};

export default AddAppointmentButton;
