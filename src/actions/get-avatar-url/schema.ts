import { z } from "zod";

import { ownerTypeSchema } from "@/types/assets-avatar";

export const getAvatarUrlActionSchema = z.object({
  ownerId: z.string(),
  ownerType: ownerTypeSchema,
});
