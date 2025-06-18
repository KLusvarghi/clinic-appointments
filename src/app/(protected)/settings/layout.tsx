"use client";

import { CreditCardIcon, Gem, SettingsIcon, UsersIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const settingsNavItems = [
  {
    title: "General",
    href: "/settings/general",
    icon: SettingsIcon,
  },
  {
    title: "Subscription",
    href: "/settings/subscription",
    icon: Gem,
  },
  {
    title: "Invoices",
    href: "/settings/invoices",
    icon: CreditCardIcon,
  },
  {
    title: "Members",
    href: "/settings/members",
    icon: UsersIcon,
  },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar Navigation */}
      <aside className="bg-background sticky top-0 h-screen w-64 shrink-0 p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold">Settings</h1>
        </div>
        <nav className="space-y-1">
          {settingsNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 px-3 py-2 text-sm font-normal",
                    isActive
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Button>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        <div className="container max-w-4xl py-12">{children}</div>
      </div>
    </div>
  );
}
