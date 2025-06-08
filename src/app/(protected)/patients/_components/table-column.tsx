"use client";
import { ColumnDef } from "@tanstack/react-table";

import { patientsTable } from "@/db/new_schema";

import TableActions from "./table-actions";

// conseguimos inferir o tipo das colunas com o $inferSelect, assim pegando o calor de cada coluna conforme o nosso schema
export const patientsTableColumns: ColumnDef<
  typeof patientsTable.$inferSelect
>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: "Name",
  },
  {
    id: "email",
    accessorKey: "email",
    header: "Email",
  },
  {
    id: "phoneNumber",
    accessorKey: "phoneNumber",
    header: "Phone",
    cell: ({ row }) => {
      const phone = row.original.phoneNumber;
      return `(${phone.slice(0, 2)}) ${phone.slice(2, 7)}-${phone.slice(7)}`;
    },
  },
  {
    id: "sex",
    accessorKey: "sex",
    header: "Sex",
    // essa função cell ela serve para renderizar o valor da coluna
    // e nele nos recebemos "params", mas podemos desestruturar o row e pegar o valor da coluna
    cell: ({ row }) => {
      return row.original.sex === "male" ? "Male" : "Female";
    },
  },
  {
    id: "actions",
    cell: (params) => {
      const patient = params.row.original;
      return <TableActions patient={patient} />;
    },
  },
];
