// import { z } from "zod";

// import { authClient } from "@/lib/auth-client";
// import { protectedWithRoleActionClient } from "@/lib/next-safe-action";

// const schema = z.object({
//   sessionId: z.string(),
// });

// export const revokeSession = protectedWithRoleActionClient
//   .schema(schema)
//   .action(async ({ parsedInput }) => {
//     await authClient.revokeSession({
//       token: parsedInput.sessionId,
//     });

//     return { success: true };
//   });
