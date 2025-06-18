"use client";

import * as React from "react";

import { Select } from "@/components/ui/select";
import { Locale, useLocale } from "@/providers/locale-provider";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocale(e.target.value as Locale);
  };
  return (
    <Select
      onValueChange={() =>handleChange}
      defaultValue={locale}
      // className="bg-background rounded border p-1 text-sm"
    >
      <option value="en">EN</option>
      <option value="pt">PT</option>
    </Select>
  );
}
