"use client";

import { EditIcon, Loader2, MoreVerticalIcon, TrashIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";

import { deleteUser } from "@/actions/delete-user";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Member } from "../_types";
import UpsertUserForm from "./upsert-user-form";

interface TableActionsProps {
  member: Member;
  onDelete?: () => void;
}

export default function TableActions({ member, onDelete }: TableActionsProps) {
  const [open, setOpen] = useState(false);

  const deleteMemberAction = useAction(deleteUser, {
    onSuccess: () => {
      toast.success("Member deleted successfully.");
      onDelete?.(); 
    },
    onError: () => {
      toast.error("Error deleting member.");
    },
  });

  const handleDeleteMemberClick = () => {
    deleteMemberAction.execute({ id: member.user?.id || "" });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVerticalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <EditIcon className="mr-2 h-4 w-4" /> Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <TrashIcon className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure you want to delete this patient?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will delete the patient and
                  all their appointments.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteMemberClick}
                  disabled={deleteMemberAction.isPending}
                >
                  {deleteMemberAction.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuContent>
      </DropdownMenu>
      <UpsertUserForm
        isOpen={open}
        member={member}
        onSuccess={() => setOpen(false)}
      />
    </Dialog>
  );
}
