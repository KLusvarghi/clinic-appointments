"use client";

import {
  CalendarDays,
  LayoutDashboard,
  Stethoscope,
  UserPlus2,
  UsersRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { useChangeClinicAction } from "@/client-actions/use-change-clinic";
import { LoadingOverlay } from "@/components/ui/loadingOverlay";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";

import ClinicFormComponent from "./clinic-form";
import { ClinicSelector } from "./clinic-selector";
import { NavItem, NavMain } from "./nav-main";
import { NavSecondary, NavSecondaryItem } from "./nav-secondary";
import { NavUser } from "./nav-user";

/**
 * Container componente responsável por:
 *  • Carregar sessão do usuário uma única vez.
 *  • Construir menus e delegar exibição.
 *  • Orquestrar actions globais (logout / troca de clínica).
 */
export function AppSidebar() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [openForm, setOPenForm] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const changeClinicAction = useChangeClinicAction();

  // -------------------------------------------------------------------------
  // Domain‑level data --------------------------------------------------------
  // -------------------------------------------------------------------------

  const isAdmin = session?.user?.clinic?.role === "ADMIN";

  const mainItems: ReadonlyArray<NavItem> = React.useMemo(
    () => [
      {
        type: "group",
        title: "Dashboard",
        icon: LayoutDashboard,
        defaultOpen: true,
        // primeira rota servirá como “principal” (renderizada no mount)
        children: [
          {
            type: "link",
            title: "Overview",
            url: "/dashboard",
            icon: LayoutDashboard,
          },
          {
            type: "link",
            title: "Patients Metrics",
            url: "/dashboard/metrics/patients",
            icon: LayoutDashboard,
          },
        ],
      },
      {
        type: "link",
        title: "Appointments",
        url: "/appointments",
        icon: CalendarDays,
      },
      { type: "link", title: "Doctors", url: "/doctors", icon: Stethoscope },
      { type: "link", title: "Patients", url: "/patients", icon: UsersRound },
    ],
    [],
  );

  const secondaryItems: ReadonlyArray<NavSecondaryItem> = React.useMemo(
    () => [
      // { title: "Settings", url: "/settings", icon: Settings },
      ...(isAdmin
        ? ([
            { type: "link", title: "Users", url: "/users", icon: UserPlus2 },
            // { title: "Active Sessions", url: "/sessions", icon: KeyRound },
          ] as const)
        : []),
    ],
    [isAdmin],
  );
  // -------------------------------------------------------------------------
  // Actions ------------------------------------------------------------------
  // -------------------------------------------------------------------------

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await authClient.signOut({
        fetchOptions: { onSuccess: () => router.push("/auth/sign-in") },
      });
    } finally {
      setIsSigningOut(false);
    }
  };

  // -------------------------------------------------------------------------
  // Render -------------------------------------------------------------------
  // -------------------------------------------------------------------------

  return (
    <>
      {(isSigningOut || changeClinicAction.isPending) && (
        <LoadingOverlay
          message={isSigningOut ? "Signing out..." : "Switching clinic..."}
        />
      )}
      {openForm && (
        <ClinicFormComponent
          isOpen={openForm}
          setIsOpen={() => setOPenForm(false)}
        />
      )}
      <Sidebar>
        <SidebarHeader className="border-b-4 p-2">
          <ClinicSelector
            clinics={session?.user.clinics ?? []}
            selectedClinic={session?.user.clinic}
            onSelectClinic={({ clinicId }) =>
              changeClinicAction.execute({ clinicId })
            }
            onAddClinic={() => setOPenForm(true)}
          />
        </SidebarHeader>

        <SidebarContent>
          <NavMain items={mainItems} />
          <NavSecondary items={secondaryItems} />
        </SidebarContent>

        <SidebarFooter>
          <NavUser session={session} onSignOut={handleSignOut} />
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
