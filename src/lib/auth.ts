// tudo que é feito aqui, roda ao lado do servidor
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { customSession } from "better-auth/plugins";
import { eq } from "drizzle-orm";

import { db } from "@/db";
// pegando todos os schemas que estão sendo exportados lá de "schemas"
import * as schema from "@/db/schema";
import { usersToClinicsTable } from "@/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // pg of "postgres"
    usePlural: true, // para que o drizzle use o plural do nome da tabela
    schema, // passando o schema que criamos lá de "schemas"
  }),
  // Configuração para autenticação com google:
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  // o better auth, quando se quer fazer algo a mais, ele tem esse sistema de plugins, tendo vários tipos e um deles é o "customSession"
  // para que possamos modificar o que o "authClient.useSession" retorna, precisamos usar esse "customSession" e customizar a sessão do meu usuário:
  plugins: [
    // e ele recebe uma arrowfunction e já desestruturamos as props
    customSession(async ({ user, session }) => {
      // e aqui dentro, fazemos nada menos que uma query dentro da tabela de relacioamento "users and clinics"
      // assim tendo apenas os dados do relacionamento entre o user e a clinica
      const clinics = await db.query.usersToClinicsTable.findMany({
        where: eq(usersToClinicsTable.userId, user.id),
        // E nesse caso precisamos do nome da clinica, para isso, apenas:
        with: {
          clinic: true,
          // user: true, // caso quisessemos os dados do user
        },
      });
      // TODO: No futuro, alterar essa lógica para que retorne todas as clinicas do usuário, não apenas a primeira ocorrencia
      const clinic = clinics?.[0];
      return {
        user: {
          ...user, // retorna todos os dados do user
          // Tendo que fazer essa validação que pelo menos retorne undefined e não de crash a aplicação 
          clinic: clinic?.clinicId
            ? {
                id: clinic?.clinicId,
                name: clinic?.clinic?.name,
              }
            : undefined,
        },
        session,
      };
    }),
  ],

  // lembra do schema que o better-auth criou? enttão, temos que deixar explicito o nome das variáveis que usamos conforme as tabelas:
  user: {
    modelName: "usersTable",
  },
  account: {
    modelName: "accountsTable",
  },
  session: {
    modelName: "sessionsTable",
  },
  verification: {
    modelName: "verificationsTable",
  },
  emailAndPassword: {
    // queremos que o user possar logar com email e senha. https://www.better-auth.com/docs/basic-usage#email--password
    enabled: true,
  },
});
