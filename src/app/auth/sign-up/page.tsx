import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

import { SignUpForm } from "../_components/sign-up-form";

const AlphSignUpPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="w-[400px]">
        <SignUpForm />
      </div>
    </div>
  );
};

export default AlphSignUpPage;
