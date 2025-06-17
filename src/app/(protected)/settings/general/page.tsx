import { headers } from "next/headers";

import { PageContainer, PageContent } from "@/components/ui/page-container";
import WithAuthentication from "@/hocs/with-authentication";
import { auth } from "@/lib/auth";

import ProfileForm from "../_components/profile-form";
import ClinicNameForm from "./_components/clinic-name-form";
import PasswordForm from "./_components/password-form";
import PreferencesForm from "./_components/preferences-form";

export default async function GeneralSettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <WithAuthentication mustHaveClinic>
      <PageContainer>
        <PageContent>
          <ProfileForm
            user={{ name: session!.user.name, email: session!.user.email }}
          />
          <ClinicNameForm defaultName={session!.user.clinic!.name} />
          <PasswordForm />
          <PreferencesForm
            defaultLanguage={session!.user.preferences?.language}
            defaultTheme={session!.user.preferences?.theme}
          />
        </PageContent>
      </PageContainer>
    </WithAuthentication>
  );
}
