import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

import SubscriptionPlan from "../(protected)/subscription/_components/subscription-plan";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/auth");
  }
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <div className="mb-8 w-full max-w-3xl text-center">
        <h1 className="mb-4 text-3xl font-bold text-gray-900">
          Unlock the full potential of your clinic
        </h1>
        <p className="mb-6 text-xl text-gray-600">
          To continue using our platform and transform the management of your
          clinic, you need to choose a plan that suits your needs.
        </p>
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="font-medium text-amber-800">
            🚀{" "}
            <span className="font-semibold">
              Professionals who use our platform save an average of 15 hours per
              week
            </span>{" "}
            in administrative tasks. Don&apos;t waste more time with manual
            schedules and inefficient processes!
          </p>
        </div>
      </div>

      <div className="w-full max-w-md">
        <SubscriptionPlan userEmail={session.user.email} />
      </div>

      <div className="mt-8 max-w-lg text-center">
        <p className="text-sm text-gray-500">
          Junte-se a mais de 2.000 profissionais de saúde que já transformaram
          sua rotina com nossa solução. Garantia de satisfação de 30 dias ou seu
          dinheiro de volta.
        </p>
      </div>
    </div>
  );
}
