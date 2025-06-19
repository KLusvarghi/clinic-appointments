"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

import UpsertUserForm from "./upsert-user-form";

export default function AddUserButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add new user
        </Button>
      </DialogTrigger>
      <UpsertUserForm isOpen={isOpen} onSuccess={() => setIsOpen(false)} />
    </Dialog>
  );
}
