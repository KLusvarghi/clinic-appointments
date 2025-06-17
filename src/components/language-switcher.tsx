"use client";

import { Locale,useLocale } from "@/providers/locale-provider";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocale(e.target.value as Locale);
  };
  return (
    <select
      onChange={handleChange}
      value={locale}
      className="border rounded p-1 text-sm bg-background"
    >
      <option value="en">EN</option>
      <option value="pt">PT</option>
    </select>
  );
}
