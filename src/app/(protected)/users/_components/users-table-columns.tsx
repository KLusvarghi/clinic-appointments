"use client";
import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";

import type { Member, UserRole } from "./upsert-user-form";
import TableActions from "./users-table-actions";

export const usersTableColumns: ColumnDef<Member>[] = [
  {
    id: "name",
    header: "Name",
    cell: ({ row }) => row.original.user?.name,
  },
  {
    id: "email",
    header: "Email",
    cell: ({ row }) => row.original.user?.email,
  },
  {
    id: "role",
    header: "Role",
    cell: ({ row }) => {
      const role: UserRole = row.original.role;
      return <Badge variant="secondary">{role}</Badge>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <TableActions member={row.original} />,
  },
];
