import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

const Authenticated = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const hasSession = session?.user

  if (hasSession) {
    redirect("/dashboard");
  }

  if (hasSession && !session.user.clinic) {
    redirect("/clinic-form");
  }

  return children;
};

export default Authenticated;
