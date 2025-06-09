import { and, eq, isNull } from "drizzle-orm";
import { headers } from "next/headers";

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
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // o "promise.all" é usado para executar as consultas em paralelo, então todas essas querys no banco de dados serão executadas ao mesmo tempo, nos dando mais performance
  const [patients, doctors, appointments] = await Promise.all([
    db.query.patientsTable.findMany({
      // Para que ele não de erro achando que a session é null (sneod que ele nem renderiza o componente se for nulo), usamos "!" para forçar o typescript a aceitar que a session não é nula
      where: and(
        eq(patientsTable.clinicId, session!.user.clinic!.id),
        isNull(patientsTable.deletedAt),
      ),
    }),
    db.query.doctorsTable.findMany({
      where: and(
        eq(doctorsTable.clinicId, session!.user.clinic!.id),
        isNull(doctorsTable.deletedAt),
      ),
    }),
    db.query.appointmentsTable.findMany({
      where: and(
        eq(appointmentsTable.clinicId, session!.user.clinic!.id),
        isNull(appointmentsTable.deletedAt),
      ),
      with: {
        patient: true,
        doctor: true,
      },
    }),
  ]);

  return (
    <WithAuthentication  mustHaveClinic>
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
