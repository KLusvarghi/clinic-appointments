import "better-auth";

import { UserPreferences } from "./user-preferences";

declare module "better-auth" {
  interface User {
    preferences: UserPreferences | null;
  }
  interface Session {
    user: {
      preferences: UserPreferences | null;
    };
  }
}
