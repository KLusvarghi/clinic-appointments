import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

import SignOutButton from "./components/sign-out-button";

// um server componente ele pode ser assincrono e pode chamar seu banco de dados, por isso o next é um framework fullstack
const DashboardPage = async () => {
  // obtendo os dados da sessão
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/authentication");
  }

  return (
    <div>
      <h1>{session?.user?.name}</h1>
      <SignOutButton />
    </div>
  );
};

export default DashboardPage;
