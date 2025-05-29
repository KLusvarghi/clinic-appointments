"use client"

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

// um server componente ele pode ser assincrono e pode chamar seu banco de dados, por isso o next é um framework fullstack
const DashboardPage = () => {
  // obtendo os dados da sessão
  const session = authClient.useSession();
  return (
    <div>
      <h1>{session?.data?.user?.name}</h1>
      <Button onClick={() => authClient.signOut()}>Sing Out</Button>
    </div>
  );
};

export default DashboardPage;
