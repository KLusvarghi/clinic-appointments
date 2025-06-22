import { headers } from "next/headers";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageContainer, PageContent } from "@/components/ui/page-container";
import { Separator } from "@/components/ui/separator";
import WithAuthentication from "@/hocs/with-authentication";
import { auth } from "@/lib/auth";

import ClinicForm from "./_components/clinic-form";
import PasswordForm from "./_components/password-form";
import PreferencesForm from "./_components/preferences-form";
import ProfileForm from "./_components/profile-form";

export default async function GeneralSettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const id = session!.user.id;
  const name = session!.user.name;
  const email = session!.user.email;
  const clinicName = session!.user.clinic!.name;
  const language = session!.user.preferences?.language;
  const theme = session!.user.preferences?.theme;

  return (
    <WithAuthentication mustHaveClinic>
      <PageContainer>
        <PageContent className="mx-auto max-w-4xl space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              General Settings
            </h1>
            <p className="text-muted-foreground">
              Manage your account settings and preferences.
            </p>
          </div>

          <Separator />

          {/* Profile Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Profile Information
              </CardTitle>
              <CardDescription>
                Update your personal information and profile picture.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileForm
                user={{ name, email, id}}
              />
            </CardContent>
          </Card>

          {/* Clinic Section */}
          <Card>
            <CardHeader>
              <CardTitle>Clinic Information</CardTitle>
              <CardDescription>
                Manage your clinic details and settings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ClinicForm defaultName={clinicName} />
            </CardContent>
          </Card>

          {/* Security Section */}
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>
                Update your password to keep your account secure.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PasswordForm />
            </CardContent>
          </Card>

          {/* Preferences Section */}
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>
                Customize your experience with language and theme settings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PreferencesForm
                defaultLanguage={language}
                defaultTheme={theme}
              />
            </CardContent>
          </Card>
        </PageContent>
      </PageContainer>
    </WithAuthentication>
  );
}
