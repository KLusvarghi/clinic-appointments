export type UserPreferences = {
  theme: "light" | "dark" | "system" | null;
  language: "pt-BR" | "en-US" | null;
  dashboardLayout: "compact" | "comfortable" | null;
  defaultClinicId: string | null;
  notifications: {
    email: boolean;
    push: boolean;
  };
};
