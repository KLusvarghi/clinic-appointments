"use client";

import { useAction } from "next-safe-action/hooks";
import { useCallback, useState } from "react";
import { toast } from "sonner";

import { revokeSession } from "@/actions/revoke-session";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { sessionsTable } from "@/db/schema";

interface SessionsTableProps {
  sessions: typeof sessionsTable.$inferSelect[];
}

const SessionsTable = ({ sessions: initialSessions }: SessionsTableProps) => {
  const [sessions, setSessions] = useState(initialSessions);

  const revokeSessionAction = useAction(revokeSession, {
    onSuccess: () => {
      toast.success("Session revoked successfully");
    },
    onError: () => {
      toast.error("Failed to revoke session");
    },
  });

  const handleRevokeSession = useCallback(
    async (sessionId: string) => {
      const res = await revokeSessionAction.execute({ sessionId });
      if (res?.success) {
        setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      }
    },
    [revokeSessionAction],
  );

  if (!sessions.length) {
    return null;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>IP Address</TableHead>
            <TableHead>User Agent</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Expires At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sessions.map((s) => (
            <TableRow key={s.id}>
              {/* <TableCell>{s.user.email}</TableCell> */}
              <TableCell>{s.ipAddress || "Unknown"}</TableCell>
              <TableCell>{s.userAgent || "Unknown"}</TableCell>
              <TableCell>
                {new Date(s.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {new Date(s.expiresAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRevokeSession(s.id)}
                  // disabled={s.id === session.data.session.id}
                >
                  Revoke
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SessionsTable;
