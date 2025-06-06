// tudo que é feito aqui, roda ao lado do servidor
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { customSession } from "better-auth/plugins";
import { eq } from "drizzle-orm";

import { db } from "@/db";
// pegando todos os schemas que estão sendo exportados lá de "schemas"
import * as schema from "@/db/schema";
import { usersToClinicsTable } from "@/db/schema";

// neste caso, exécificamos o tempo para evitar números mágicos, ficando mais facil a compreensão
const FIVE_MINUES = 5 * 60;

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
          user: true, 
        },
      });
      // TODO: No futuro, alterar essa lógica para que retorne todas as clinicas do usuário, não apenas a primeira ocorrencia
      // TODO: 
      const clinic = clinics?.[0];

      // nesse return, quando a gente queiser pegar a session, poderemos acessar todos esses dados abaixo
      return {
        user: {
          ...user, // retorna todos os dados do user
          // Tendo que fazer essa validação que pelo menos retorne undefined e não de crash a aplicação

          subscriptionPlan: clinic?.user.subscriptionPlan, // aqui estamos pegando o plano do usuário, que está na tabela de relacionamento entre o user e a clinica
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

    // passando esses campos adicionais para o schema do user, que não estão no schema que criamos, mas que o better-auth criou
    additionalFields: {
      stripeCustomerId: {
        type: "string",
        fieldName: "stripeCustomerId",
        required: false,
      },
      stripeSubscriptionId: {
        type: "string",
        fieldName: "stripeSubscriptionId",
        required: false,
      },
      subscriptionPlan: {
        type: "string",
        fieldName: "subscriptionPlan",
        required: false,
      },
    },
  },
  account: {
    modelName: "accountsTable",
  },
  session: {
    modelName: "sessionsTable",

    // aqui  nós implementamos o cache, assim, ao invés de toda vez bater naquela rota de api.getSession, ele antes verifica se existe esse cache no cookie, se existir, ele retorna o cache, se não existir, ele busca no banco de dados e salva no cookie, para que na próxima vez que a pessoa fizer uma requisição, ele já tenha o cache salvo no cookie.
    // porem, ele apenas verifica se tem chache, mas não valida ele, de certo modo nos ajuda a fazer essa validação de se existe cookie, mas não valida ele
    // mas de qualquer forma diminue bastante a quantidade de chamadas
    cookieCache: {
      enabled: true,
      maxAge: FIVE_MINUES,
    },
  },
  verification: {
    modelName: "verificationsTable",
  },
  emailAndPassword: {
    // queremos que o user possar logar com email e senha. https://www.better-auth.com/docs/basic-usage#email--password
    enabled: true,
  },
});
