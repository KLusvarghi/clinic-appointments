import { UserPreferences } from "@/types/user-preferences";

export const persistPreferences = (prefs: UserPreferences | null) => {
  if (typeof window !== "undefined" && prefs) {
    localStorage.setItem("preferences", JSON.stringify(prefs));
  }
};
