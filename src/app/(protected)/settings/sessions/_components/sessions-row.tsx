import { Loader2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { parseUserAgentInfo } from "@/helpers/parse-user-agent";
import { SessionWithUser } from "@/types/session-with-user";

interface Props {
  session: SessionWithUser;
  isLoading: boolean;
  onRevoke: (id: string) => void;
  isCurrentSession: boolean;
}

export const SessionRow = ({
  session,
  onRevoke,
  isCurrentSession,
  isLoading,
}: Props) => {
  return (
    <TableRow key={session.id}>
      <TableCell>{session.user.name || "Unknown"}</TableCell>
      <TableCell>{session.user.email || "Unknown"}</TableCell>
      <TableCell>{parseUserAgentInfo(session.userAgent ?? "")}</TableCell>
      <TableCell>{new Date(session.createdAt).toLocaleDateString()}</TableCell>
      <TableCell>{new Date(session.expiresAt).toLocaleDateString()}</TableCell>
      <TableCell>
        {isCurrentSession ? (
          <Badge className="bg-green-100 text-blue-700 hover:bg-blue-100">
            Actual
          </Badge>
        ) : (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onRevoke(session.token)}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Revoking...
              </>
            ) : (
              "Revoke"
            )}
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
};
