"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { clinicsTable, usersToClinicsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

export const createClinic = async (name: string) => {
  //  antes de inserir dados, temos que validar se o usuário está logado:
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  // basicamente para inserir um dado, temos que chamar o nosso arquivo que faz ligação com nosso banco "db" e depois passar o schema da tabela que queremos add o valor, passando como primeiro parametro o valor e o segundo
  // como a criação ele retorna uma lista de valores, podemos pegar esse valor pela chave dele diretamente com []
  // lembrando que o returning é para retornar o valor que acabamos de inserir
  const [clinic] = await db
    .insert(clinicsTable)
    .values({
      name,
    })
    .returning();
  //  após criar a clinica, temos outra tabela que faz a relação de usuário com clinica, tendo que fazer essa realção tbm:
  await db.insert(usersToClinicsTable).values({
    userId: session.user.id, // id do usuário que está logado
    clinicId: clinic.id, // id da clinica que acabamos de criar
  });
  // e assim que tudo for feito, redirecionamos para a dashboard:
  redirect("/dashboard");
};
