"use client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { appointmentsTable } from "@/db/new_schema";

import AppointmentsTableActions from "./table-actions";

type AppointmentWithRelations = typeof appointmentsTable.$inferSelect & {
  patient: {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    sex: "male" | "female";
  };
  doctor: {
    id: string;
    name: string;
    specialty: string;
  };
};

// conseguimos inferir o tipo das colunas com o $inferSelect, assim pegando o calor de cada coluna conforme o nosso schema
export const appointmentsTableColumns: ColumnDef<AppointmentWithRelations>[] = [
  {
    id: "patient",
    accessorKey: "patient.name",
    header: "Patient",
  },
  {
    id: "doctor",
    accessorKey: "doctor.name",
    header: "Doctor",
    cell: (params) => {
      // Para pegar os dados do médico temos que:
      const appointment = params.row.original;
      return `${appointment.doctor.name}`;
    },
  },
  {
    id: "date",
    accessorKey: "date",
    header: "Data e Hora",
    cell: (params) => {
      const appointment = params.row.original;
      // ele pega a data e hora do agendamento e formata para o formato dd/MM/yyyy 'às' HH:mm
      return format(new Date(appointment.date), "dd/MM/yyyy '-' HH:mm", {
        locale: ptBR,
      });
    },
  },
  {
    id: "specialty",
    // aqui estamos acessando a especialidade do médico, que está na tabela de médicos
    // a para eu ter acesso a essa especialidade e ao atributos da tabela "doctor" eu preciso, ao fazer a query na tabela de appointments, preciso passar o with: { doctor: true }, assim ele faz um join entre as tabelas e eu tenho acesso aos dados dele tbm
    accessorKey: "doctor.specialty",
    header: "Specialty",
  },
  {
    id: "price",
    accessorKey: "appointmentPriceInCents",
    header: "Valor",
    cell: (params) => {
      const appointment = params.row.original;
      const price = appointment.appointmentPriceInCents / 100;
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(price);
    },
  },
  {
    id: "actions",
    cell: (params) => {
      const appointment = params.row.original;
      return <AppointmentsTableActions appointment={appointment} />;
    },
  },
];
