import { headers } from "next/headers";
import { createSafeActionClient } from "next-safe-action";

import { auth } from "./auth";

// para configuração, criamos uma função que retorna o actionClient
export const actionClient = createSafeActionClient();

// criando uma outra safe action client que vai proteger as actions
// assim, com essa safe action eu consigo validar meu user aqui pra não ter que chamar meu bd no meu componente
export const protectedActionClient = createSafeActionClient().use(
  async ({ next }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) throw new Error("Unauthorized");

    // e eu consigo retornar um contexto que vai ser passado para todas as actions
    return next({
      ctx: {
        user: session.user, 
      },
    });
  },
);

// aqui nós vamos expandir o actionClient se baseando na de cima
export const protectedWithClinicActionClient = protectedActionClient.use(
  async ({ next, ctx }) => {
    if (!ctx.user.clinic?.id) throw new Error("Clinic not found!");

    // e eu consigo retornar um contexto que vai ser passado para todas as actions
    return next({
      ctx: {
        ...ctx.user,
        clinic: ctx.user.clinic!, // preciso colocar o ! pois o user.clinic é opcional, mas eu sei que ele existe
      },
    });
  },
);