import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

// Higher Order Component (HOC) -> é uma função que recebe um componente e o renderiza, mas, antes de renderizado, ele executa alguma ação, podendo passar alguma props para o componente, e retorna um novo componente com funcionalidades adicionais

// então basicamente esse componente ele é um HOC, e iremos encolver ele no "page.tsx" passanod as props que ele precisa, se precisar de um plano, uma clinica, para acessar a página ele vai validar isso e se não atender a essas condições, ele redireciona para a página de authentication ou clinic-form
const WithAuthentication = async ({
  children,
  mustHavePlan = false,
  mustHaveClinic = false,
}: {
  children: React.ReactNode;
  mustHavePlan?: boolean;
  mustHaveClinic?: boolean;
}) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/authentication");
  }

  if (mustHavePlan && !session.user.subscriptionPlan) {
    redirect("/new-subscription");
  }

  if (mustHaveClinic && !session.user.clinic) {
    redirect("/clinic-form");
  }

  return children;
};

export default WithAuthentication;

// e podemos usar o withAuthentication para validar se o usuário está autenticado
// e se não estiver, ele redireciona para a página de login
