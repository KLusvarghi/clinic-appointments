import "dotenv/config";

import { drizzle } from "drizzle-orm/node-postgres";

import * as schema from "./schema";

// para que possamos ter o auto complite das entidades/tabelas do banco de dados, passamos como segundo argumento o schema
export const db = drizzle(process.env.DATABASE_URL!, {
  schema,
});
