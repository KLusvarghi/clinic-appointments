import dayjs from "dayjs";
import { and, count, desc, eq, gte, lte, sql, sum } from "drizzle-orm";
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

import { AppointmentsChart } from "./_components/appointments-chart";
import { DatePicker } from "./_components/date-picker";
import StatsCard from "./_components/stats-card";
import TopDoctors from "./_components/top-doctors";
import TopSpecialties from "./_components/top-specialties";

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
    topDoctors,
    topSpecialties,
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
    db
      .select({
        id: doctorsTable.id,
        name: doctorsTable.name,
        avatarImageUrl: doctorsTable.avatarImageUrl,
        specialty: doctorsTable.specialty,
        appointments: count(appointmentsTable.id),
      })
      .from(doctorsTable) // pegando todos os médicos da clínica
      // fazendo um left join com a tabela de agendamentos, para pegar o total de agendamentos de cada médico
      .leftJoin(
        appointmentsTable, // passando a tabela de agendamentos
        and(
          // onde os agendamentos pertencem ao médico
          eq(appointmentsTable.doctorId, doctorsTable.id),
          // onde os agendamentos estão dentro do periodo selecionado
          gte(appointmentsTable.date, new Date(from)),
          lte(appointmentsTable.date, new Date(to)),
        ),
      )
      // pegando apenas os médicos que pertencem a clínica
      .where(eq(doctorsTable.clinicId, session.user.clinic.id))
      // agrupando pelo id do médico
      .groupBy(doctorsTable.id)
      // ordenando pelo total de agendamentos, em ordem decrescente
      .orderBy(desc(count(appointmentsTable.id)))
      // limitando para 10 médicos
      .limit(10),
    db
      .select({
        specialty: doctorsTable.specialty, // selecionando as especialidades da tabela de médicos
        appointments: count(appointmentsTable.id), // contando o total de agendamentos
      })
      .from(appointmentsTable) // pegando da tablema de agendamentos
      // basicamente irei pegar a especialidade dde cada médico
      .innerJoin(doctorsTable, eq(appointmentsTable.doctorId, doctorsTable.id)) // fazendo um inner join com a tabela de médicos, para pegar a especialidade de cada médico
      .where(
        and(
          eq(appointmentsTable.clinicId, session.user.clinic.id), // onde o clinicId é igual ao clinicId da sessão
          gte(appointmentsTable.date, new Date(from)),
          lte(appointmentsTable.date, new Date(to)),
        ),
      )
      .groupBy(doctorsTable.specialty) // agrupando pela especialidade
      .orderBy(desc(count(appointmentsTable.id))),
  ]);

  // aqui ele pega a data de hoje e subtrai 10 dias e pega o inicio desse periodo
  const chartStartDate = dayjs().subtract(10, "days").startOf("day").toDate();
  const chartEndDate = dayjs().add(10, "days").endOf("day").toDate();

  const dailyAppointmentsData = await db
    .select({
      // nesse date, ele está convertendo para string, pois ele vem como um objeto date do javascript
      date: sql<string>`DATE(${appointmentsTable.date})`.as("date"),
      appointments: count(appointmentsTable.id), // conto o total de agendamentos
      // o coalesce é para caso não tenha receita, ele retorna 0
      // mas ele faz a soma dos valores dos agendamentos de cada dia e converte para number
      revenue:
        sql<number>`COALESCE(SUM(${appointmentsTable.appointmentPriceInCents}), 0)`.as(
          "revenue",
        ),
    })
    .from(appointmentsTable)
    .where(
      and(
        eq(appointmentsTable.clinicId, session.user.clinic.id), // onde o clinicId é igual ao clinicId da sessão
        gte(appointmentsTable.date, chartStartDate), // onde a data é maior ou igual ao inicio do periodo
        lte(appointmentsTable.date, chartEndDate), // onde a data é menor ou igual ao fim do periodo
      ),
    )
    .groupBy(sql`DATE(${appointmentsTable.date})`) // agrupando pelos dias
    .orderBy(sql`DATE(${appointmentsTable.date})`); // ordenando pelos dias (1, 2, 3....)

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
        <div className="grid grid-cols-[2.25fr_1fr] gap-4">
          <AppointmentsChart dailyAppointmentsData={dailyAppointmentsData} />
          <TopDoctors doctors={topDoctors} />
          <TopSpecialties topSpecialties={topSpecialties} />  
        </div>
      </PageContent>
    </PageContainer>
  );
};

export default DashboardPage;
