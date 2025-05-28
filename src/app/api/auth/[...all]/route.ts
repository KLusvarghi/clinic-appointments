// Para lidar com solicitações de API, você precisa configurar um manipulador de rotas no seu servidor.
// https://www.better-auth.com/docs/basic-usage#nextjs

import { toNextJsHandler } from "better-auth/next-js";

import { auth } from "@/lib/auth"; // path to your auth file

export const { POST, GET } = toNextJsHandler(auth);
