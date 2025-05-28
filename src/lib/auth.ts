import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { db } from "@/db";
// pegando todos os schemas que estão sendo exportados lá de "schemas"
import * as schema from "@/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // pg of "postgres"
    usePlural: true, // para que o drizzle use o plural do nome da tabela
    schema, // passando o schema que criamos lá de "schemas"
  }),
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
