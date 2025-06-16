import { sql } from "drizzle-orm";
import { pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

import { assetTypeEnum, ownerTypeEnum } from "./enums";

export const assetsTable = pgTable(
  "assets",
  {
    id: text("id").primaryKey().$defaultFn(nanoid),
    ownerType: ownerTypeEnum("owner_type").notNull(),
    ownerId: text("owner_id").notNull(),
    type: assetTypeEnum("type").notNull(),
    s3Key: text("s3_key").notNull(),
    mime: text("mime").notNull(),
    size: text("size"),
    uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
  },
  (tbl) => ({
    uniqUserAvatar: uniqueIndex("uniq_user_avatar")
      .on(tbl.ownerId)
      .where(sql`${tbl.ownerType} = 'user' AND ${tbl.type} = 'user_avatar'`),
  }),
);
