import { customSessionClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import { auth } from "./auth";

// para que ele leve em consideração as propriedades customizadas que criamos no "auth.ts" que fica dentro de "pluguins",
export const authClient = createAuthClient({
  plugins: [customSessionClient<typeof auth>()],
});

// como nossa api é integrada co o next, não tem essa necessidade de passar o baseURL
//   {
//     baseURL: "http://localhost:3000"
// }
