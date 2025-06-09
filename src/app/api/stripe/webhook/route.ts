import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import Stripe from "stripe";

import { db } from "@/db";
import { subscriptionsTable } from "@/db/new_schema";

export const POST = async (request: Request) => {
  // Essa chave usaremos para validar que quem está chamando nossa rota POST/nosso webhook, está autoriazada, que no caso tem que ser o stripe
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return new Response("Stripe webhook secret is not set", { status: 400 });
  }

  // se tiver a chave de webhook, podemos processar
  // sendo essa signature (assinatura) a chave de autenticação do stripe, que ele nos passa no header da requisição
  // é ela que iremos usar para validar se é o stripe que está chamando nosso webhook
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return new Response("Stripe signature is not set", { status: 400 });
  }

  // pegando toda minha request que recebemos
  const body = await request.text();

  // instanciando o stripe
  const stripe = new Stripe(process.env.STRIPE_WEBHOOK_SECRET, {
    apiVersion: "2025-05-28.basil", // passando a mesma versão que usamos na server action
  });

  // para fazer essa validação o stripe utiliza HMAC com SHA256, para garantir que o conteúdo dela não foi alterada

  // processando a requisição, basicamnete estamos validando se a requisição é do stripe e se é válida
  const event = stripe.webhooks.constructEvent(
    // descritivamente, estamos validando se o body da requisição e a signature são válidas com base na "STRIPE_WEBHOOK_SECRET"
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET,
  );

  // event.type nos retorna diversas informações sobre o evento que ocorreu, que seriam os possiveis resultados de nossa requisição, como se o pagamento foi feito, se foi feito um cancelamento, entre outros
  switch (
    event.type // https://docs.stripe.com/api/events/types
  ) {
    case "invoice.paid": // esse evento é disparado quando um pagamento é feito com sucesso
      // vamos lançlar um erro caso o a seguinte condição não exista, mas ele basicamente sempre existe, mas o typescript não sabe disso
      if (!event.data.object.id) throw new Error("Subscription ID is not set");

      // agora, precisamos recuperar a subscription desse evento, que no caso seria nosso plano de assintaura "essential", e dentro do event conseguimos pegar isso
      const { customer, parent } = event.data.object as unknown as {
        customer: string;
        parent: {
          subscription_details: {
            subscription: string;
            metadata: {
              userId: string;
            };
          };
        };
      };

      // quando criamos nossa session com o server action, passamos no "matadata" o id do usuário, e agora precisamos recuperar esse id para atualziar o plano do usuário no banco de dados
      const userId = parent.subscription_details.metadata.userId;
      const subscription = parent.subscription_details.subscription;

      if (!userId) throw new Error("User ID is not set");

      // agora, precisamos atualizar o plano do usuário no banco de dados
      await db
        .update(subscriptionsTable)
        .set({
          plan: "essential",
          stripeCustomerId: customer,
          stripeSubscriptionId: subscription,
        })
        .where(eq(subscriptionsTable.id, userId));
      break;

    case "customer.subscription.deleted": {
      if (!event.data.object.id) throw new Error("Subscription ID is not set");

      // precisando pegar a subscription do usuário que foi cancelado, que é basicamente o plano que ele tinha
      const { metadata } = event.data.object as unknown as {
        metadata: {
          userId: string;
        };
      };

      // quando criamos nossa session com o server action, passamos no "matadata" o id do usuário, e agora precisamos recuperar esse id para atualziar o plano do usuário no banco de dados
      const userId = metadata.userId;

      if (!userId) throw new Error("User ID is not set");

      // agora, precisamos atualizar o plano do usuário no banco de dados
      await db
        .update(subscriptionsTable)
        .set({
          plan: "free",
          stripeCustomerId: null,
          stripeSubscriptionId: null,
        })
        .where(eq(subscriptionsTable.id, userId));
    }
  }
  // tendo que retornar isso porque o stripe espera uma resposta, se não enviarmos que o webhook foi processado, ele continuará tentando processars
  return NextResponse.json({
    recived: true,
  });
};
