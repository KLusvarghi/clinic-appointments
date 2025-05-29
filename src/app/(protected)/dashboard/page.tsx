import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

import SignOutButton from "./_components/sign-out-button";

// um server componente ele pode ser assincrono e pode chamar seu banco de dados, por isso o next é um framework fullstack
const DashboardPage = async () => {
  // obtendo os dados da sessão
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/authentication");
  }

  // como o session.user tem acesso as clinicas, não precisamos mais dessa query aqui
  
  // // ele deve retornar um array, se o array for vazio, o user não tem clinica
  // const clinics = await db.query.usersToClinicsTable.findMany({
  //   // verificamos se o userId que está no banco é o mesmo que o da sessão
  //   where: eq(usersToClinicsTable.userId, session.user.id),
  // });

  if (!session.user.clinic) {
    redirect("/clinic-form");
  }

  return (
    <div>
      <h1>{session?.user?.name}</h1>
      <h1>{session?.user?.email}</h1>
      <SignOutButton />
    </div>
  );
};

export default DashboardPage;
