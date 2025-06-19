"use client";

import { useState } from "react";

import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";

import type { Member } from "./upsert-user-form";
import { usersTableColumns } from "./users-table-columns";

interface UsersTableProps {
  members: Member[];
}

export default function UsersTable({ members }: UsersTableProps) {
  const [search, setSearch] = useState("");

  const filtered = members.filter((m) => {
    const term = search.toLowerCase();
    return (
      m.user?.name.toLowerCase().includes(term) ||
      m.user?.email.toLowerCase().includes(term) ||
      m.role.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-4">
      <Input
        placeholder="Buscar usuários..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />
      <DataTable data={filtered} columns={usersTableColumns} />
    </div>
  );
}
