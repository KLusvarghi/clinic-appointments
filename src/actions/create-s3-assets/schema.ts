import { z } from "zod";

import { assetTypeSchema, ownerTypeSchema } from "@/types/assets-avatar";

export const createS3AssetSchema = z.object({
  file: z.instanceof(File),
  ownerId: z.string(),
  ownerType: ownerTypeSchema,
  type: assetTypeSchema,
});

export type CreateS3AssetInput = z.infer<typeof createS3AssetSchema>;
