
import { headers } from "next/headers";

import {
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import WithAuthentication from "@/hocs/with-authentication";
import { auth } from "@/lib/auth";

import SessionsTable from "./_components/sessions-table";

const SessionsPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });

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
          <SessionsTable sessions={session!.sessions ?? []} />
        </PageContent>
      </PageContainer>
    </WithAuthentication>
  );
};

export default SessionsPage;
