import { and, eq, isNull } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

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
import { db } from "@/db";
import {
  appointmentsTable,
  doctorsTable,
  patientsTable,
} from "@/db/new_schema";
import WithAuthentication from "@/hocs/with-authentication";
import { auth } from "@/lib/auth";

import AddAppointmentButton from "./_components/add-appointment-button";
import { appointmentsTableColumns } from "./_components/table-column";

const AppointmentsPage = async () => {
  // COMO ERA FEITA A VALIDAÇÃO NO CLIENT SIDE ANTES
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/authentication");
  }

  if (!session.user.clinic) {
    redirect("/clinic-form");
  }

  if (!session.user.subscriptionPlan) {
    redirect("/new-subscription");
  }

  // o "promise.all" é usado para executar as consultas em paralelo, então todas essas querys no banco de dados serão executadas ao mesmo tempo, nos dando mais performance
  const [patients, doctors, appointments] = await Promise.all([
    db.query.patientsTable.findMany({
      where: and(
        eq(patientsTable.clinicId, session.user.clinic.id),
        isNull(patientsTable.deletedAt),
      ),
    }),
    db.query.doctorsTable.findMany({
      where: and(
        eq(doctorsTable.clinicId, session.user.clinic.id),
        isNull(doctorsTable.deletedAt),
      ),
    }),
    db.query.appointmentsTable.findMany({
      where: and(
        eq(appointmentsTable.clinicId, session.user.clinic.id),
        isNull(appointmentsTable.deletedAt),
      ),
      with: {
        patient: true,
        doctor: true,
      },
    }),
  ]);

  return (
    // COMO ERA FEITA A VALIDAÇÃO NO CLIENT SIDE AGORA
    <WithAuthentication mustHavePlan mustHaveClinic>
      <PageContainer>
        <PageHeader>
          <PageHeaderContent>
            <PageTitle>Agendamentos</PageTitle>
            <PageDescription>
              Gerencie os agendamentos da sua clínica
            </PageDescription>
          </PageHeaderContent>
          <PageActions>
            <AddAppointmentButton patients={patients} doctors={doctors} />
          </PageActions>
        </PageHeader>
        <PageContent>
          <DataTable data={appointments} columns={appointmentsTableColumns} />
        </PageContent>
      </PageContainer>
    </WithAuthentication>
  );
};

export default AppointmentsPage;
