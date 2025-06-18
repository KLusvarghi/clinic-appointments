"use client";

import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

import { upsertUser } from "@/actions/upsert-user";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { userRoleEnum } from "@/db/schema";

type UserRole = (typeof userRoleEnum.enumValues)[number];

interface Member {
  id: string;
  role: UserRole;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface MembersTableProps {
  members: Member[];
}

export default function MembersTable({ members }: MembersTableProps) {
  const updateRoleAction = useAction(upsertUser, {
    onSuccess: () => toast.success("Role updated"),
    onError: () => toast.error("Failed to update role"),
  });

  const handleChange = (id: string, role: UserRole) => {
    updateRoleAction.execute({ id, role: role, email: "", name: "" });
  };

  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((m) => (
            <TableRow key={m.id}>
              <TableCell>{m.user.name}</TableCell>
              <TableCell>{m.user.email}</TableCell>
              <TableCell>
                <Select
                  defaultValue={m.role}
                  onValueChange={(value) =>
                    handleChange(m.id, value as UserRole)
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {userRoleEnum.enumValues.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
