import { createContext, ReactNode,useContext, useState } from "react";

export type Locale = "en" | "pt";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

type TranslationDictionary = {
  nav: {
    features: string;
    pricing: string;
    contact: string;
    signIn: string;
    startFree: string;
  };
  hero: {
    newIntegration: string;
    heading: string;
    description: string;
    startFree: string;
    demo: string;
    metrics1: string;
    metrics2: string;
    metrics3: string;
  };
};

const translations: Record<Locale, TranslationDictionary> = {
  en: {
    nav: {
      features: "Features",
      pricing: "Pricing",
      contact: "Contact",
      signIn: "Sign In",
      startFree: "Get Started",
    },
    hero: {
      newIntegration: "\u2728 New: WhatsApp integration available",
      heading: "Simplify your scheduling with intelligence",
      description:
        "Manage appointments, clients and payments in a single platform. Automate your business and focus on what really matters.",
      startFree: "Start Free",
      demo: "View Demo",
      metrics1: "Appointments made",
      metrics2: "Active companies",
      metrics3: "Guaranteed uptime",
    },
  },
  pt: {
    nav: {
      features: "Recursos",
      pricing: "Pre\u00e7os",
      contact: "Contato",
      signIn: "Entrar",
      startFree: "Come\u00e7ar Gr\u00e1tis",
    },
    hero: {
      newIntegration: "\u2728 Novo: Integra\u00e7\u00e3o com WhatsApp dispon\u00edvel",
      heading: "Simplifique seus agendamentos com intelig\u00eancia",
      description:
        "Gerencie compromissos, clientes e pagamentos em uma \u00fanica plataforma. Automatize seu neg\u00f3cio e foque no que realmente importa.",
      startFree: "Come\u00e7ar Gratuitamente",
      demo: "Ver Demonstra\u00e7\u00e3o",
      metrics1: "Agendamentos realizados",
      metrics2: "Empresas ativas",
      metrics3: "Uptime garantido",
    },
  },
};

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

export function LocaleProvider({
  children,
  defaultLocale = "en",
}: {
  children: ReactNode;
  defaultLocale?: Locale;
}) {
  const [locale, setLocale] = useState<Locale>(defaultLocale);

  const t = (key: string) => {
    const parts = key.split(".");
    let value: unknown = translations[locale] as Record<string, unknown>;
    for (const part of parts) {
      if (typeof value === "object" && value && part in value) {
        value = (value as Record<string, unknown>)[part];
      } else {
        return key;
      }
    }
    return typeof value === "string" ? value : key;
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
}
