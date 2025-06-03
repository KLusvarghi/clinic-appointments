import dayjs from "dayjs";
import { and, count, eq, gte, lte, sum } from "drizzle-orm";
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
import { db } from "@/db";
import { appointmentsTable, doctorsTable, patientsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import { DatePicker } from "./_components/date-picker";
import StatsCard from "./_components/stats-card";

// pegando os valores de from e to do date-picker que estão na url
interface DashboardPageProps {
  // a partir do net 15, para pegar os parametros da url, é necessário usar o searchParams e ele ser uma promise
  searchParams: Promise<{
    // os nome dos parametros na url
    from: string;
    to: string;
  }>;
}

// um server componente ele pode ser assincrono e pode chamar seu banco de dados, por isso o next é um framework fullstack
const DashboardPage = async ({ searchParams }: DashboardPageProps) => {
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

  // extraindo os valores da variável que está na url
  const { from, to } = await searchParams;

  // caso eu não tenha esses valores na url, eu trato isso:
  if (!from || !to) {
    redirect(
      `/dashboard?from=${dayjs().format("YYYY-MM-DD")}&to=${dayjs().add(1, "month").format("YYYY-MM-DD")}`,
    );
  }

  const [
    // como ele nos retorna uma lista, pegamos o primeiro item
    [totalRevenue],
    [totalAppointments],
    [totalDoctors],
    [totalPatients],
  ] = await Promise.all([
    // Total de receita
    // quando se quer fazer querys mais complexas com o drizzle, como (count, sum, etc), é melhor usar o "select"
    db
      .select({
        total: sum(appointmentsTable.appointmentPriceInCents),
      })
      .from(appointmentsTable)
      .where(
        and(
          // eq é o operador de igualdade (comparando dois valores)
          eq(appointmentsTable.clinicId, session.user.clinic.id),
          // gte = greater than or equal que é maior ou igual a
          gte(appointmentsTable.date, new Date(from)),
          // lte = letter than or equal que é menor ou igual a
          lte(appointmentsTable.date, new Date(to)),
        ),
      ),

    // Total de consultas
    db
      .select({
        total: count(),
      })
      .from(appointmentsTable)
      .where(
        and(
          eq(appointmentsTable.clinicId, session.user.clinic.id),
          gte(appointmentsTable.date, new Date(from)),
          lte(appointmentsTable.date, new Date(to)),
        ),
      ),

    // Total de médicos
    db
      .select({
        total: count(),
      })
      .from(patientsTable)
      .where(eq(patientsTable.clinicId, session.user.clinic.id)),
    db
      .select({
        total: count(),
      })
      .from(doctorsTable)
      .where(eq(doctorsTable.clinicId, session.user.clinic.id)),
  ]);

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Dashboard</PageTitle>
          <PageDescription>
            Tenha uma visão geral da sua clínica
          </PageDescription>
        </PageHeaderContent>
        <PageActions>
          <DatePicker />
        </PageActions>
      </PageHeader>
      <PageContent>
        <StatsCard
          totalRevenue={totalRevenue?.total ? Number(totalRevenue.total) : null}
          totalAppointments={totalAppointments?.total ?? null}
          totalDoctors={totalDoctors?.total ?? null}
          totalPatients={totalPatients?.total ?? null}
        />
      </PageContent>
    </PageContainer>
  );
};

export default DashboardPage;
