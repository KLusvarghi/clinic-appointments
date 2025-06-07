// a página de checkout é a página que o usuário vai ser redirecionado para fazer o pagamento, e ela é obrigatoriamente criado no backend, por isso usaremos uma server action para isso
"use server";

import { headers } from "next/headers";
import Stripe from "stripe";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";

/**
 * Gera uma sessão de checkout do Stripe para que o usuário possa assinar.
 *
 * @returns O ID da sessão criada.
 */
export const createStripeCheckout = actionClient
  // caso a gente tivesse mais de um plano fariamos assim
  // e cada plano vai ter uma sessionId diferente
  .schema(
    z.object({
      plan: z.enum(["essentials", "pro"]),
    }),
  )
  // neste caso não usaremos o schema
  .action(async () => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("Stripe secret key is not set");
    }
    // instanciando um novo cliente do stripe passando nossa secret key
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-05-28.basil", // sendo essa a versão do stripe que estamos usando
    });

    // criando a session do checkout
    const { id: sessionId } = await stripe.checkout.sessions.create({
      // aqui definimos os tipos de pagamento que o usuário vai poder usar
      // o methodo de "pix" precisa fazer alguma config extras na conta do stripe
      payment_method_types: ["card"],
      mode: "subscription", // aqui definimos que o checkout é de assinatura / um pagamento recorrente
      // aqui será a url que o usuário será redirecionado após o pagamento com sucesso
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      // aqui será a url que o usuário será redirecionado após cancelar o pagamento/assinatura
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      subscription_data: {
        // esse metadata é um objeto que será passado para o stripe/ web hook e será usado para identificar o usuário que fez o pagamento
        metadata: {
          userId: session.user.id,
        },
      },
      // aqui, definimos os itens que o usuário vai poder comprar, sendo que o plano é o item que ele vai comprar
      line_items: [
        {
          price: process.env.STRIPE_ESSETIAN_PLAN_PRICE_ID,
          quantity: 1,
        },
      ],
    });
    return {
      sessionId,
    };
  });
