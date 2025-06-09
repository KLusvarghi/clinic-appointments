"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEmailVerified } from "@/hooks/use-email-verified";

import { UpsertPatientForm } from "./upsert-patient-form";

export function AddPatientButton() {
  const [isOpen, setIsOpen] = useState(false);
  const emailVerified = useEmailVerified();

  const handleOpenChange = (open: boolean) => {
    if (open && !emailVerified) {
      toast.error("Verify your email to add a patient");
      return;
    }
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button disabled={!emailVerified}>
          <Plus className="mr-2 h-4 w-4" />
          Add new Patient
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Patient</DialogTitle>
        </DialogHeader>
        <UpsertPatientForm onSuccess={() => setIsOpen(false)} isOpen={isOpen} />
      </DialogContent>
    </Dialog>
  );
}
