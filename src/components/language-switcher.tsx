"use client";

import React from "react";

import { Select } from "@/components/ui/select";
import { Locale, useLocale } from "@/providers/locale-provider";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <Select
      aria-label="Language Selector"
      onValueChange={(value) => setLocale(value as Locale)}
      defaultValue={locale}
      // className="bg-background rounded border p-1 text-sm"
    >
      <option value="en">EN</option>
      <option value="pt">PT</option>
    </Select>
  );
}
