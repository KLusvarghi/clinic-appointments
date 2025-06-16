// tudo que é feito aqui, roda ao lado do servidor
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { customSession } from "better-auth/plugins";
import { eq, gt } from "drizzle-orm";

import { db } from "@/db";
// pegando todos os schemas que estão sendo exportados lá de "schemas"
import {
  clinicsTable,
  schema,
  sessionsTable,
  subscriptionsTable,
  usersToClinicsTable,
} from "@/db/schema";

// import { sendEmail } from "./email/send-verification-email";
import { parseCookies } from "./utils";

type UserToClinic = typeof usersToClinicsTable.$inferSelect;
type Clinic = typeof clinicsTable.$inferSelect;
type Subscription = typeof subscriptionsTable.$inferSelect;

type LoadedClinic = Clinic & { subscriptions: Subscription[] };
type ExtendedUserToClinic = UserToClinic & {
  clinic: LoadedClinic;
  user: unknown;
};

// neste caso, exécificamos o tempo para evitar números mágicos, ficando mais facil a compreensão
const TWO_MINUTE = 60 * 2;
const FIVE_MINUTES = 5 * 60;
const FIVE_DAYS = 60 * 60 * 24 * 5;

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true, // para que o drizzle use o plural do nome da tabela
    schema,
  }),
  cookieOptions: {
    secure: process.env.NODE_ENV !== "development",
  },
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
  rateLimit: {
    window: 60, // time window in seconds
    max: 100, // max requests in the window
    customRules: {
      "/auth/sign-in/email": {
        window: TWO_MINUTE,
        max: 3,
      },
      "/auth/sign-up/email": {
        window: TWO_MINUTE,
        max: 3,
      },
      "/auth/sign-in/social": {
        window: TWO_MINUTE,
        max: 3,
      },
    },
  },
  plugins: [
    // criamos um sessão customizada, para que possamos retornar mais informações do usuário, como as clinicas que ele possui, e o plano de assinatura de cada uma delas
    customSession(async ({ user, session }, ctx) => {
      const clinics = (await db.query.usersToClinicsTable.findMany({
        where: eq(usersToClinicsTable.userId, user.id),

        with: {
          user: true,
          clinic: {
            with: {
              subscriptions: true,
            },
          },
        },
      })) as ExtendedUserToClinic[];

      const clinicsData = clinics.map((c) => ({
        id: c.clinic?.id,
        name: c.clinic.name,
        plan: c.clinic.subscriptions?.[0]?.plan,
        role: c.role,
        logo: "/logo.svg",
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
            user: {
              columns: {
                email: true,
                name: true,
                image: true,
              },
            },
          },
          where: gt(sessionsTable.expiresAt, new Date()),
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
                plan: currentClinic.plan,
                logo: "/logo.svg",
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
  session: {
    cookieCache: {
      enabled: true,
      maxAge: FIVE_MINUTES,
    },
    expiresIn: FIVE_DAYS,
    cookieName: "better-auth.session_token",
    modelName: "sessionsTable",
  },
  account: {
    modelName: "accountsTable",
  },
  verification: {
    modelName: "verificationsTable",
  },
  doctor: {
    modelName: "doctorsTable",
  },
  patient: {
    modelName: "patientsTable",
  },
  clinic: {
    modelName: "clinicsTable",
  },
  appointment: {
    modelName: "appointmentsTable",
  },
  prescription: {
    modelName: "prescriptionsTable",
  },
  diagnosis: {
    modelName: "diagnosesTable",
  },
  subscription: {
    modelName: "subscriptionsTable",
  },
  usersToClinics: {
    modelName: "usersToClinicsTable",
  },
  // emailVerification: {
  //   sendEmail,
  //   sendOnSignUp: true,
  // },
  emailAndPassword: {
    // queremos que o user possar logar com email e senha. https://www.better-auth.com/docs/basic-usage#email--password
    enabled: true,
    requireEmailVerification: false,
  },
});
