import { db } from "..";
import * as schema from "../new_schema"; // sua tabela

async function seed() {
  await db.insert(schema.usersTable).values([
    {
      id: "1",
      name: "Kauã",
      email: "kaua@example.com",
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      subscriptionPlan: "free",
      stripeCustomerId: null,
      stripeSubscriptionId: null,
    },
  ]);

  console.log("Seeding completo");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
