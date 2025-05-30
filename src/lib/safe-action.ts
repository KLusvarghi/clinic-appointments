import { createSafeActionClient } from "next-safe-action";

// para configuração, criamos uma função que retorna o actionClient
export const actionClient = createSafeActionClient();