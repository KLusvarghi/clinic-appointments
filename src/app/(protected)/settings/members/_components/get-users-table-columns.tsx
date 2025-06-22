"use client";

import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";

import { Badge } from "@/components/ui/badge";

import type { Member, UserRole } from "../_types";
import { UserAvatarCellWithHook } from "./user-avatar-cell";
import TableActions from "./users-table-actions";

export function getUsersTableColumns(
  sessionUserId: string | null,
  opts: {
    onDelete: (id: string) => void;
    useGetAvatar: (userId: string | null) => string | null;
  },
): ColumnDef<Member>[] {
  return [
    {
      id: "name",
      header: "Name",
      cell: ({ row }) => {
        return (
          <UserAvatarCellWithHook
            userId={row.original.user?.id ?? null}
            name={row.original.user?.name}
            isActive={row.original.isActive}
            useGetAvatar={opts.useGetAvatar}
          />
        );
      },
    },
    {
      id: "email",
      header: "Email",
      enableHiding: true,
      cell: ({ row }) => row.original.user?.email,
    },
    {
      id: "email-verified",
      header: "Email Verified",
      enableHiding: true,
      cell: ({ row }) => {
        const verified = row.original.user?.emailVerified;
        return (
          <Badge variant={verified ? "default" : "destructive"}>
            {verified ? "Verified" : "Not Verified"}
          </Badge>
        );
      },
    },
    {
      id: "role",
      header: "Role",
      enableHiding: true,
      cell: ({ row }) => {
        const role: UserRole = row.original.role;
        return <Badge variant="secondary">{role.toLowerCase()}</Badge>;
      },
    },
    {
      id: "created_at",
      header: "Created at",
      enableHiding: true,
      cell: ({ row }) =>
        dayjs(row.original.user?.createdAt).format("DD/MM/YYYY HH:mm"),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const isCurrentSession = sessionUserId === row.original.user?.id;
        if (isCurrentSession) return <Badge variant="outline">You</Badge>;
        return (
          <TableActions
            member={row.original}
            onDelete={() => {
              const id = row.original.user?.id;
              if (id) opts.onDelete(id);
            }}
          />
        );
      },
    },
  ];
}
