"use client";

import { useAction } from "next-safe-action/hooks";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { revokeSession } from "@/actions/revoke-session";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSession } from "@/hooks/use-session";

import { SessionRow } from "./sessions-row";

const SessionsTable = () => {
  const { session, sessions } = useSession();
  const [allActiveSessions, setActiveSessions] = useState(sessions);

  useEffect(() => {
    setActiveSessions(sessions);
  }, [sessions]);

  const isCurrentSession = (id: string) => id === session?.id;

  const revokeSessionAction = useAction(revokeSession, {
    onSuccess: () => {
      toast.success("Session revoked successfully");
    },
    onError: () => {
      toast.error("Failed to revoke session");
    },
  });

  const handleRevokeSession = useCallback(
    async (sessionToken: string) => {
      console.log(sessionToken);
      const res = await revokeSessionAction.execute({ sessionToken });
      if (res) {
        setActiveSessions((prev) =>
          prev.filter((s) => s.token !== sessionToken),
        );
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
            <TableHead>Email</TableHead>
            <TableHead>User Agent</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Expires At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allActiveSessions.map((s) => (
            <SessionRow
              key={s.id}
              session={s}
              isLoading={revokeSessionAction.isPending}
              onRevoke={handleRevokeSession}
              isCurrentSession={isCurrentSession(s.id)}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SessionsTable;
