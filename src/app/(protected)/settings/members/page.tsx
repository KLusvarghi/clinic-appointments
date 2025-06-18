import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import { db } from "@/db";
import { usersToClinicsTable } from "@/db/schema";
import WithAuthentication from "@/hocs/with-authentication";
import { auth } from "@/lib/auth";

import MembersTable from "./_components/members-table";

const MembersPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const members = await db.query.usersToClinicsTable.findMany({
    where: eq(usersToClinicsTable.clinicId, session!.user.clinic!.id),
    with: {
      user: {
        columns: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return (
    <WithAuthentication mustHaveClinic>
      <PageContainer>
        <PageHeader>
          <PageHeaderContent>
            <PageTitle>Members</PageTitle>
            <PageDescription>Manage clinic users</PageDescription>
          </PageHeaderContent>
          <PageActions />
        </PageHeader>
        <PageContent>
          <MembersTable members={members} />
        </PageContent>
      </PageContainer>
    </WithAuthentication>
  );
};

export default MembersPage;
