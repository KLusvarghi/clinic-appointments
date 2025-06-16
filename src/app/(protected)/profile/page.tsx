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

import ProfileForm from "./_components/profile-form";

const ProfilePage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <WithAuthentication mustHaveClinic>
      <PageContainer>
        <PageHeader>
          <PageHeaderContent>
            <PageTitle>My Profile</PageTitle>
            <PageDescription>Update your profile information</PageDescription>
          </PageHeaderContent>
        </PageHeader>
        <PageContent>
          {session?.user && <ProfileForm user={session.user} />}
        </PageContent>
      </PageContainer>
    </WithAuthentication>
  );
};

export default ProfilePage;