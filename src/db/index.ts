import "dotenv/config";
import "./new_schema";

import { drizzle } from "drizzle-orm/node-postgres";

import * as schema from "./new_schema";

export const db = drizzle(process.env.DATABASE_URL!, {
  schema,
});
