"use client";
import { ColumnDef } from "@tanstack/react-table";
import classNames from "classnames";
import dayjs from "dayjs";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import type { Member, UserRole } from "../_types";
import TableActions from "./users-table-actions";

export function getUsersTableColumns(
  sessionUserId: string | null,
  opts: { onDelete: (id: string) => void },
): ColumnDef<Member>[] {
  return [
    {
      id: "name",
      header: "Name",
      cell: ({ row }) => {
        const name = row.original.user?.name;
        const avatar = row.original.user?.avatarId;
        const isActive = row.original.isActive;
        return (
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar>
                <AvatarImage src={avatar} alt={`${name} avatar`} />
                <AvatarFallback>{name?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span
                className={classNames(
                  "border-background absolute -end-0.5 -bottom-0.5 size-3 rounded-full border-2",
                  {
                    "bg-green-500": isActive,
                    "bg-red-500": !isActive,
                  },
                )}
              >
                <span className="sr-only">
                  {isActive ? "Online" : "Offline"}
                </span>
              </span>
            </div>
            <div>
              <div className="font-medium">{name}</div>
            </div>
          </div>
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
