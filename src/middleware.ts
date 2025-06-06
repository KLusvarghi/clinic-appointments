// é basicamente uma função é executado em um ambiente EDGE que é executado antes de determinada rota (a gente pode definir isso no next.config.js)

// (EDGE ENVIRONMENT) -> Ele roda uma versão "minificada" do node.js e roda perto do usuário

// o next recomenda não usar middleware para slow data fetching e session management ( que é o que fazemso na nossas pages quando verificamos os usuários)
// e um middleare precisa ser rodada muito rápido, e quando fazemos um req HTTP (mesmo que esteja chacheada) não é recomendado fazer data fetching
// https://nextjs.org/docs/app/building-your-application/routing/middleware
import { getSessionCookie } from "better-auth/cookies";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// https://www.better-auth.com/docs/integrations/next#middleware
//  e no better-auth, ele da a opção de verificar se existe um cookie usando o middleware do next, porém ele só verifica se não, não valida ele
export function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/authentication", request.url));
  }

  // se nada acontecer, ele apenas direciona para a rota que ele estava tentando acessar
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  // esse matcher é um regex, onde passamos as rotas que queremos que o middleware seja executado
  matcher: [
    // "/dashboard/:path*", // ele add as rotas que vem depois de /dashboard
    "/dashboard/",
    "/appointments/",
    "/clinic-form/",
    "/doctors/",
    "/patients/",
    "/subscription/",
  ],

  // se a a gente colocar esse regex abaixo, ele não irá execurat em "api", arquivos estaticos, imagens, etc
  //  matcher: '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
};
