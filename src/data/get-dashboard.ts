// import dayjs from "dayjs";
// import { and, count, desc, eq, gte, isNull, lte, sql, sum } from "drizzle-orm";

// import { db } from "@/db";
// import { appointmentsTable, doctorsTable, patientsTable } from "@/db/schema";

// interface Params {
//   from: string;
//   to: string;
//   session: {
//     user: {
//       clinic: {
//         id: string;
//       };
//     };
//   };
// }

// export const getDashboard = async ({ from, to, session }: Params) => {
//   // aqui ele pega a data de hoje e subtrai 10 dias e pega o inicio desse periodo
//   const chartStartDate = dayjs().subtract(10, "days").startOf("day").toDate();
//   const chartEndDate = dayjs().add(10, "days").endOf("day").toDate();

//   const [
//     // como ele nos retorna uma lista, pegamos o primeiro item
//     [totalRevenue],
//     [totalAppointments],
//     [totalDoctors],
//     [totalPatients],
//     topDoctors,
//     topSpecialties,
//     todayAppointments,
//     dailyAppointmentsData,
//   ] = await Promise.all([
//     // Total de receita
//     // quando se quer fazer querys mais complexas com o drizzle, como (count, sum, etc), é melhor usar o "select"
//     db
//       .select({
//         total: sum(appointmentsTable.appointmentPriceInCents),
//       })
//       .from(appointmentsTable)
//       .where(
//         and(
//           // eq é o operador de igualdade (comparando dois valores)
//           eq(appointmentsTable.clinicId, session.user.clinic.id),
//           // gte = greater than or equal que é maior ou igual a
//           gte(appointmentsTable.date, new Date(from)),
//           // lte = letter than or equal que é menor ou igual a
//           lte(appointmentsTable.date, new Date(to)),
//           isNull(appointmentsTable.deletedAt),
//         ),
//       ),

//     // Total de consultas
//     db
//       .select({
//         total: count(),
//       })
//       .from(appointmentsTable)
//       .where(
//         and(
//           eq(appointmentsTable.clinicId, session.user.clinic.id),
//           gte(appointmentsTable.date, new Date(from)),
//           lte(appointmentsTable.date, new Date(to)),
//           isNull(appointmentsTable.deletedAt),
//         ),
//       ),

//     // Total de médicos
//     db
//       .select({
//         total: count(),
//       })
//       .from(patientsTable)
//       .where(
//         and(
//           eq(patientsTable.clinicId, session.user.clinic.id),
//           isNull(patientsTable.deletedAt),
//         ),
//       ),
//     db
//       .select({
//         total: count(),
//       })
//       .from(doctorsTable)
//       .where(
//         and(
//           eq(doctorsTable.clinicId, session.user.clinic.id),
//           isNull(doctorsTable.deletedAt),
//         ),
//       ),
//     db
//       .select({
//         id: doctorsTable.id,
//         name: doctorsTable.name,
//         avatarImageUrl: doctorsTable.avatarImageUrl,
//         specialty: doctorsTable.specialty,
//         appointments: count(appointmentsTable.id),
//       })
//       .from(doctorsTable) // pegando todos os médicos da clínica
//       // fazendo um left join com a tabela de agendamentos, para pegar o total de agendamentos de cada médico
//       .leftJoin(
//         appointmentsTable, // passando a tabela de agendamentos
//         and(
//           // onde os agendamentos pertencem ao médico
//           eq(appointmentsTable.doctorId, doctorsTable.id),
//           // onde os agendamentos estão dentro do periodo selecionado
//           gte(appointmentsTable.date, new Date(from)),
//           lte(appointmentsTable.date, new Date(to)),
//           isNull(appointmentsTable.deletedAt),
//         ),
//       )
//       // pegando apenas os médicos que pertencem a clínica
//       .where(
//         and(
//           eq(doctorsTable.clinicId, session.user.clinic.id),
//           isNull(doctorsTable.deletedAt),
//         ),
//       )
//       // agrupando pelo id do médico
//       .groupBy(doctorsTable.id)
//       // ordenando pelo total de agendamentos, em ordem decrescente
//       .orderBy(desc(count(appointmentsTable.id)))
//       // limitando para 10 médicos
//       .limit(10),
//     db
//       .select({
//         specialty: doctorsTable.specialty, // selecionando as especialidades da tabela de médicos
//         appointments: count(appointmentsTable.id), // contando o total de agendamentos
//       })
//       .from(appointmentsTable) // pegando da tablema de agendamentos
//       // basicamente irei pegar a especialidade dde cada médico
//       .innerJoin(doctorsTable, eq(appointmentsTable.doctorId, doctorsTable.id)) // fazendo um inner join com a tabela de médicos, para pegar a especialidade de cada médico
//       .where(
//         and(
//           eq(appointmentsTable.clinicId, session.user.clinic.id), // onde o clinicId é igual ao clinicId da sessão
//           gte(appointmentsTable.date, new Date(from)),
//           lte(appointmentsTable.date, new Date(to)),
//           isNull(appointmentsTable.deletedAt),
//           isNull(doctorsTable.deletedAt),
//         ),
//       )
//       .groupBy(doctorsTable.specialty) // agrupando pela especialidade
//       .orderBy(desc(count(appointmentsTable.id))),
//     // pegando os agendamentos de hojes
//     db.query.appointmentsTable.findMany({
//       where: and(
//         eq(appointmentsTable.clinicId, session.user.clinic.id),
//         gte(appointmentsTable.date, new Date()),
//         lte(appointmentsTable.date, new Date()),
//         isNull(appointmentsTable.deletedAt),
//       ),
//       with: {
//         patient: true,
//         doctor: true,
//       },
//     }),
//     db
//       .select({
//         // nesse date, ele está convertendo para string, pois ele vem como um objeto date do javascript
//         date: sql<string>`DATE(${appointmentsTable.date})`.as("date"),
//         appointments: count(appointmentsTable.id), // conto o total de agendamentos
//         // o coalesce é para caso não tenha receita, ele retorna 0
//         // mas ele faz a soma dos valores dos agendamentos de cada dia e converte para number
//         revenue:
//           sql<number>`COALESCE(SUM(${appointmentsTable.appointmentPriceInCents}), 0)`.as(
//             "revenue",
//           ),
//       })
//       .from(appointmentsTable)
//       .where(
//         and(
//           eq(appointmentsTable.clinicId, session.user.clinic.id), // onde o clinicId é igual ao clinicId da sessão
//           gte(appointmentsTable.date, chartStartDate), // onde a data é maior ou igual ao inicio do periodo
//           lte(appointmentsTable.date, chartEndDate), // onde a data é menor ou igual ao fim do periodo
//           isNull(appointmentsTable.deletedAt),
//         ),
//       )
//       .groupBy(sql`DATE(${appointmentsTable.date})`) // agrupando pelos dias
//       .orderBy(sql`DATE(${appointmentsTable.date})`), // ordenando pelos dias (1, 2, 3....)s
//   ]);
//   return {
//     totalRevenue,
//     totalAppointments,
//     totalPatients,
//     totalDoctors,
//     topDoctors,
//     topSpecialties,
//     todayAppointments,
//     dailyAppointmentsData,
//   };
// };

import dayjs from "dayjs";
import { and, count, desc, eq, gte, lte, sql, sum } from "drizzle-orm";

import { db } from "@/db";
import { appointmentsTable, doctorsTable, patientsTable } from "@/db/schema";

interface Params {
  from: string;
  to: string;
  session: {
    user: {
      clinic: {
        id: string;
      };
    };
  };
}

export const getDashboard = async ({ from, to, session }: Params) => {
  const chartStartDate = dayjs().subtract(10, "days").startOf("day").toDate();
  const chartEndDate = dayjs().add(10, "days").endOf("day").toDate();
  const [
    [totalRevenue],
    [totalAppointments],
    [totalPatients],
    [totalDoctors],
    topDoctors,
    topSpecialties,
    todayAppointments,
    dailyAppointmentsData,
  ] = await Promise.all([
    db
      .select({
        total: sum(appointmentsTable.appointmentPriceInCents),
      })
      .from(appointmentsTable)
      .where(
        and(
          eq(appointmentsTable.clinicId, session.user.clinic.id),
          gte(appointmentsTable.date, new Date(from)),
          lte(appointmentsTable.date, new Date(to)),
        ),
      ),
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
        // avatarImageUrl: doctorsTable.,
        specialty: doctorsTable.specialty,
        appointments: count(appointmentsTable.id),
      })
      .from(doctorsTable)
      .leftJoin(
        appointmentsTable,
        and(
          eq(appointmentsTable.doctorId, doctorsTable.id),
          gte(appointmentsTable.date, new Date(from)),
          lte(appointmentsTable.date, new Date(to)),
        ),
      )
      .where(eq(doctorsTable.clinicId, session.user.clinic.id))
      .groupBy(doctorsTable.id)
      .orderBy(desc(count(appointmentsTable.id)))
      .limit(10),
    db
      .select({
        specialty: doctorsTable.specialty,
        appointments: count(appointmentsTable.id),
      })
      .from(appointmentsTable)
      .innerJoin(doctorsTable, eq(appointmentsTable.doctorId, doctorsTable.id))
      .where(
        and(
          eq(appointmentsTable.clinicId, session.user.clinic.id),
          gte(appointmentsTable.date, new Date(from)),
          lte(appointmentsTable.date, new Date(to)),
        ),
      )
      .groupBy(doctorsTable.specialty)
      .orderBy(desc(count(appointmentsTable.id))),
    db.query.appointmentsTable.findMany({
      where: and(
        eq(appointmentsTable.clinicId, session.user.clinic.id),
        gte(appointmentsTable.date, new Date()),
        lte(appointmentsTable.date, new Date()),
      ),
      with: {
        patient: true,
        doctor: true,
      },
    }),
    db
      .select({
        date: sql<string>`DATE(${appointmentsTable.date})`.as("date"),
        appointments: count(appointmentsTable.id),
        revenue:
          sql<number>`COALESCE(SUM(${appointmentsTable.appointmentPriceInCents}), 0)`.as(
            "revenue",
          ),
      })
      .from(appointmentsTable)
      .where(
        and(
          eq(appointmentsTable.clinicId, session.user.clinic.id),
          gte(appointmentsTable.date, chartStartDate),
          lte(appointmentsTable.date, chartEndDate),
        ),
      )
      .groupBy(sql`DATE(${appointmentsTable.date})`)
      .orderBy(sql`DATE(${appointmentsTable.date})`),
  ]);
  return {
    totalRevenue,
    totalAppointments,
    totalPatients,
    totalDoctors,
    topDoctors,
    topSpecialties,
    todayAppointments,
    dailyAppointmentsData,
  };
};
