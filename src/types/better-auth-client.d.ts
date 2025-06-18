import "better-auth/client"; // ← mesmo módulo que você importa no código

import { UserPreferences } from "./user-preferences";

declare module "better-auth/client" {
  interface User {
    preferences: UserPreferences | null;
  }
}
