// tudo que é feito aqui, roda ao lado do servidor
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { customSession } from "better-auth/plugins";
import { eq } from "drizzle-orm";

import { db } from "@/db";
// pegando todos os schemas que estão sendo exportados lá de "schemas"
import * as schema from "@/db/schema/schema";
import { usersToClinicsTable } from "@/db/schema/schema";

import { sendVerificationEmail } from "./email/send-verification-email";
import { parseCookies } from "./utils";

// neste caso, exécificamos o tempo para evitar números mágicos, ficando mais facil a compreensão
const FIVE_MINUTES = 5 * 60;
const TWO_MINUTE = 60 * 2;

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // pg of "postgres"
    usePlural: true, // para que o drizzle use o plural do nome da tabela
    schema, // passando o schema que criamos lá de "schemas"
  }),
  cookieOptions: {
    secure: process.env.NODE_ENV !== "development",
  },

  rateLimit: {
    window: 60, // time window in seconds
    max: 100, // max requests in the window
    customRules: {
      "/sign-in/email": {
        window: TWO_MINUTE,
        max: 3,
      },
      "/sign-up/email": {
        window: TWO_MINUTE,
        max: 3,
      },
      "/sign-in/social": {
        window: TWO_MINUTE,
        max: 3,
      },
    },
  },

  // Configuração para autenticação com google e Linkedin:
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    // linkedin: {
    //   clientId: process.env.LINKEDIN_CLIENT_ID as string,
    //   clientSecret: process.env.LINKEDIN_CLIENT_SECRET as string,
    // },
  },

  plugins: [
    // criamos um sessão customizada, para que possamos retornar mais informações do usuário, como as clinicas que ele possui, e o plano de assinatura de cada uma delas
    customSession(async ({ user, session }, ctx) => {
      const clinics = await db.query.usersToClinicsTable.findMany({
        where: eq(usersToClinicsTable.userId, user.id),

        with: {
          clinic: {
            with: {
              subscriptions: true,
            },
          },
          user: true,
        },
      });

      const clinicsData = clinics.map((c) => ({
        id: c.clinic?.id,
        name: c.clinic.name,
        plan: c.clinic.subscriptions?.[0]?.plan,
        role: c.role,
      }));

      const cookies = parseCookies(ctx.headers?.get("cookie"));
      const selectedClinicId = cookies["clinic_id"];
      const currentClinic =
        clinicsData.find((c) => c.id === selectedClinicId) ?? clinicsData[0];

      // Only fetch active sessions for admin users
      let sessions;
      if (currentClinic?.role === "ADMIN") {
        sessions = await db.query.sessionsTable.findMany({
          with: {
            //   user: {
            //     columns: {
            //       email: true,
            //     },
            //   },
            // },

            user: true,
          },
          // where: isNull(sessionsTable.),
        });
      }

      return {
        user: {
          ...user,
          clinics: clinicsData,
          plan: currentClinic?.plan,
          clinic: currentClinic
            ? {
                id: currentClinic.id,
                name: currentClinic.name,
                role: currentClinic.role,
              }
            : undefined,
        },
        session,
        sessions,
      };
    }),
  ],

  // lembra do schema que o better-auth criou? enttão, temos que deixar explicito o nome das variáveis que usamos conforme as tabelas:
  user: {
    modelName: "usersTable",

    // passando esses campos adicionais para o schema do user, que não estão no schema que criamos, mas que o better-auth criou
    additionalFields: {
      preferences: {
        type: "string[]",
        fieldName: "preferences",
        required: false,
      },
      lastLoginAt: {
        type: "date",
        fieldName: "lastLoginAt",
        required: false,
      },
      deletedAt: {
        type: "date",
        fieldName: "deletedAt",
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
      maxAge: FIVE_MINUTES,
    },
    cookieName: "better-auth.session_token",
  },
  verification: {
    modelName: "verificationsTable",
  },
  emailVerification: {
    sendVerificationEmail,
    sendOnSignUp: true,
  },
  emailAndPassword: {
    // queremos que o user possar logar com email e senha. https://www.better-auth.com/docs/basic-usage#email--password
    enabled: true,
    requireEmailVerification: false,
  },
});
