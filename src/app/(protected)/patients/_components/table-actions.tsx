"use client";

import { EditIcon, MoreVerticalIcon, TrashIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { patientsTable } from "@/db/schema";

import { UpsertPatientForm } from "./upsert-patient-form";

interface TableActionsProps {
  patient: typeof patientsTable.$inferSelect;
}

const TableActions = ({ patient }: TableActionsProps) => {
  const [upsertDialogIsOpen, setUpsertDialogIsOpen] = useState(false);

  return (
    <Dialog open={upsertDialogIsOpen} onOpenChange={setUpsertDialogIsOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="ghost" size="icon">
            <MoreVerticalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>{patient.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setUpsertDialogIsOpen(true)}>
            {" "}
            <EditIcon /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem>
            {" "}
            <TrashIcon /> Exclude
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <UpsertPatientForm
        isOpen={upsertDialogIsOpen}
        patient={patient}
        onSuccess={() => setUpsertDialogIsOpen(false)}
      />
    </Dialog>
  );
};

export default TableActions;
