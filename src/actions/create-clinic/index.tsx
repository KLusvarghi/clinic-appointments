"use server";

import { redirect } from "next/navigation";

import { db } from "@/db";
import { clinicsTable, usersToClinicsTable } from "@/db/schema";
import { protectedActionClient } from "@/lib/next-safe-action";

/**
 * Cria uma clínica para o usuário autenticado e o associa a ela.
 *
 * @param ctx - Contexto com o usuário autenticado.
 */
export const createClinic = protectedActionClient.action(async ({ ctx }) => {
  //  antes de inserir dados, temos que validar se o usuário está logado:

  // basicamente para inserir um dado, temos que chamar o nosso arquivo que faz ligação com nosso banco "db" e depois passar o schema da tabela que queremos add o valor, passando como primeiro parametro o valor e o segundo
  // como a criação ele retorna uma lista de valores, podemos pegar esse valor pela chave dele diretamente com []
  // lembrando que o returning é para retornar o valor que acabamos de inserir
  const [clinic] = await db
    .insert(clinicsTable)
    .values({
      name: ctx.user.name,
    })
    .returning();
    
  //  após criar a clinica, temos outra tabela que faz a relação de usuário com clinica, tendo que fazer essa realção tbm:
  await db.insert(usersToClinicsTable).values({
    userId: ctx.user.id, // id do usuário que está logado
    clinicId: clinic.id, // id da clinica que acabamos de criar
  });
  // e assim que tudo for feito, redirecionamos para a dashboard:
  redirect("/dashboard");
});
