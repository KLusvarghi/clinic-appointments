import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import {
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

import UsersTable from "./_components/users-table";
import { Member } from "./_types";

const MembersSettingsPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user.clinic?.id) {
    throw new Error("Sessão inválida: clínica não encontrada.");
  }

  const members = (await db.query.usersToClinicsTable.findMany({
    where: eq(usersToClinicsTable.clinicId, session?.user.clinic?.id),
    with: {
      user: true,
    },
  })) as Member[];

  const activeMembers = members.filter((m) => m.user?.deletedAt === null);
  // const inactiveMembers = members.filter((m) => m.user?.deletedAt !== null);

  return (
    <WithAuthentication mustHaveRole="ADMIN">
      <PageContainer>
        <PageHeader>
          <PageHeaderContent>
            <PageTitle>Users</PageTitle>
            <PageDescription>Manage clinic users</PageDescription>
          </PageHeaderContent>
        </PageHeader>
        <PageContent>
          <UsersTable
            // inactiveMembers={inactiveMembers}
            activeMembers={activeMembers}
            userId={session?.user?.id}
          />
        </PageContent>
      </PageContainer>
    </WithAuthentication>
  );
};

export default MembersSettingsPage;
