"use client";

import { Plus } from "lucide-react";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

import UpsertUserForm from "./upset-user-form";

const AddUserButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = React.useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [dialogMode, setDialogMode] = React.useState<"create" | "edit">(
    "create",
  );

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleCreateUser = () => {
    setSelectedUser(null);
    setDialogMode("create");
    setIsDialogOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setDialogMode("edit");
    setIsDialogOpen(true);
  };

  const handleDeleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((user) => user.id !== userId));
  };

  const handleSaveUser = (userData: Omit<User, "id" | "createdAt">) => {
    if (dialogMode === "create") {
      const newUser: User = {
        ...userData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split("T")[0],
      };
      setUsers((prev) => [...prev, newUser]);
    } else if (selectedUser) {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === selectedUser.id ? { ...user, ...userData } : user,
        ),
      );
    }
    setIsDialogOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          {/* <Button disabled={!emailVerified}> */}
          <Plus />
          Add new doctor
        </Button>
      </DialogTrigger>
      {/* <UpsertUserForm onSuccess={() => setIsOpen(false)} isOpen={isOpen} /> */}
      <UpsertUserForm
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        mode={dialogMode}
        user={selectedUser}
        onSave={handleSaveUser}
      />
    </Dialog>
  );
};

export default AddUserButton;
