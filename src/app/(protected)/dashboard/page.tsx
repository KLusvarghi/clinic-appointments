import { headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import { auth } from "@/lib/auth";

import { DatePicker } from "./_components/date-picker";

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
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Dashboard</PageTitle>
          <PageDescription>
            Gerencie os pacientes da sua clínica
          </PageDescription>
        </PageHeaderContent>
        <PageActions>
          <DatePicker />
        </PageActions>
      </PageHeader>
      <PageContent>
        <></>
        {/* sendo esse o componente que criamos e para ele passamos as colunas que teremos */}
      </PageContent>
    </PageContainer>
  );
};

export default DashboardPage;
