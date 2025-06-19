import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import WithAuthentication from "@/hocs/with-authentication";

import SessionsTable from "./_components/sessions-table";
const SessionsPage = async () => {
  return (
    <WithAuthentication mustHaveRole="ADMIN">
      <PageContainer>
        <PageHeader>
          <PageHeaderContent>
            <PageTitle>Active Sessions</PageTitle>
            <PageDescription>Manage active user sessions</PageDescription>
          </PageHeaderContent>
        </PageHeader>
        <PageContent>
          <SessionsTable />
        </PageContent>
        <PageContainer>
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive flex items-center gap-2">
                <Badge variant="destructive" className="text-xs">
                  DANGER ZONE
                </Badge>
              </CardTitle>
              <CardDescription>
                <strong>Revoke all sessions</strong>
                <br />
                All of the sessions data will be{" "}
                <strong>revoke</strong>. This action is not
                reversible, so please continue with caution.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="destructive">Revoke All Sessions</Button>
            </CardContent>
          </Card>
        </PageContainer>
      </PageContainer>
    </WithAuthentication>
  );
};

export default SessionsPage;
