import { headers } from "next/headers";

import { PageContainer, PageContent } from "@/components/ui/page-container";
import { auth } from "@/lib/auth";

import SubscriptionPlan from "./_components/subscription-plan";

const SubscriptionPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  return (
    <PageContainer>
      <PageContent>
        <SubscriptionPlan
          className="w-[350px]"
          active={session!.user.plan === "essential"}
          userEmail={session!.user.email}
        />
      </PageContent>
      <div>
        {/* <h2 className="text-3xl font-semibold">Billing</h2> */}
        <p className="text-muted-foreground mt-2">
          Manage your billing information and subscription.
        </p>
      </div>
      <div className="text-muted-foreground py-12 text-center">
        Billing settings coming soon...
      </div>
    </PageContainer>
  );
};

export default SubscriptionPage;
