import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

import { AlphSignInForm } from "../alph/_components/alph-signin-form";

const AlphSignInPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="w-[400px]">
        <AlphSignInForm />
      </div>
    </div>
  );
};

export default AlphSignInPage;
