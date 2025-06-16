"use client";

import {
  CalendarDays,
  Gem,
  KeyRound,
  LayoutDashboard,
  Settings,
  Stethoscope,
  UsersRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useChangeClinicAction } from "@/client-actions/use-change-clinic";
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
  const changeClinicAction = useChangeClinicAction();

  // -------------------------------------------------------------------------
  // Domain‑level data --------------------------------------------------------
  // -------------------------------------------------------------------------

  const isAdmin = session?.user?.clinic?.role === "ADMIN";

  const mainItems: ReadonlyArray<NavItem> = [
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
  ];

  const secondaryItems: ReadonlyArray<NavSecondaryItem> = [
    { title: "Subscription", url: "/subscription", icon: Gem },
    { title: "Settings", url: "/settings", icon: Settings },
    ...(isAdmin
      ? ([
          { title: "Active Sessions", url: "/sessions", icon: KeyRound },
        ] as const)
      : []),
  ];

  // -------------------------------------------------------------------------
  // Actions ------------------------------------------------------------------
  // -------------------------------------------------------------------------

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: { onSuccess: () => router.push("/auth/sign-in") },
    });
  };

  // -------------------------------------------------------------------------
  // Render -------------------------------------------------------------------
  // -------------------------------------------------------------------------

  return (
    <>
      {openForm && (
        <ClinicFormComponent
          isOpen={openForm}
          setIsOpen={() => setOPenForm(false)}
        />
      )}
      <Sidebar>
        <SidebarHeader className="border-b-4 p-2">
          {/* <Image
          src="/logo.svg"
          alt="Doctor Calendar"
          width={120}
          height={40}
          priority
        /> */}
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
