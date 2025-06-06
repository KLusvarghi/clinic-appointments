import dayjs from "dayjs";
import { Calendar } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import { getDashboard } from "@/data/get-dashboard";
import WithAuthentication from "@/hocs/with-authentication";
import { auth } from "@/lib/auth";

import { appointmentsTableColumns } from "../appointments/_components/table-column";
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

  // como o session.user tem acesso as clinicas, não precisamos mais dessa query aqui

  // // ele deve retornar um array, se o array for vazio, o user não tem clinica
  // const clinics = await db.query.usersToClinicsTable.findMany({
  //   // verificamos se o userId que está no banco é o mesmo que o da sessão
  //   where: eq(usersToClinicsTable.userId, session.user.id),
  // });

  // if (!session.user.subscriptionPlan) {
  //   redirect("/new-subscription");
  // }

  // extraindo os valores da variável que está na url
  const { from, to } = await searchParams;

  // caso eu não tenha esses valores na url, eu trato isso:
  if (!from || !to) {
    redirect(
      `/dashboard?from=${dayjs().format("YYYY-MM-DD")}&to=${dayjs().add(1, "month").format("YYYY-MM-DD")}`,
    );
  }

  const {
    totalRevenue,
    totalAppointments,
    totalPatients,
    totalDoctors,
    topDoctors,
    topSpecialties,
    todayAppointments,
    dailyAppointmentsData,
  } = await getDashboard({
    from,
    to,
    session: {
      user: {
        clinic: {
          id: session!.user.clinic!.id,
        },
      },
    },
  });

  return (
    <WithAuthentication mustHavePlan mustHaveClinic>
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
            totalRevenue={
              totalRevenue?.total ? Number(totalRevenue.total) : null
            }
            totalAppointments={totalAppointments?.total ?? null}
            totalDoctors={totalDoctors?.total ?? null}
            totalPatients={totalPatients?.total ?? null}
          />
          <div className="grid grid-cols-[2.25fr_1fr] gap-4">
            <AppointmentsChart dailyAppointmentsData={dailyAppointmentsData} />
            <TopDoctors doctors={topDoctors} />
          </div>
          <div className="grid grid-cols-[2.25fr_1fr] gap-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Calendar className="text-muted-foreground" />
                  <CardTitle className="text-base">
                    Today Appointments
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={appointmentsTableColumns}
                  data={todayAppointments}
                />
              </CardContent>
            </Card>
            <TopSpecialties topSpecialties={topSpecialties} />
          </div>
        </PageContent>
      </PageContainer>
    </WithAuthentication>
  );
};

export default DashboardPage;
