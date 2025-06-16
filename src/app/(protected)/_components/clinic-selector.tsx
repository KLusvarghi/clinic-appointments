"use client";

import { CheckIcon, ChevronsUpDownIcon, PlusIcon } from "lucide-react";
import * as React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface Clinic {
  id: string;
  name: string;
  role: string;
  plan: string;
  logo: string;
}

interface ClinicSelectorProps {
  clinics: Clinic[];
  selectedClinic?: Clinic;
  onSelectClinic?: (clinicId: string) => void;
  onAddClinic?: () => void;
}

export function ClinicSelector({
  clinics,
  selectedClinic,
  onSelectClinic,
  onAddClinic,
}: ClinicSelectorProps) {
  const [open, setOpen] = React.useState(false);

  // If no clinics exist, show just the name and image without dropdown
  if (!clinics || clinics.length === 0) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground h-12 px-3"
          >
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-600 text-white">
              <span className="text-sm font-semibold">NC</span>
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">Does not have any Clinic</span>
              <span className="text-muted-foreground truncate text-xs">
                Add a clinic
              </span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  const currentClinic = selectedClinic || clinics[0];

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-sidebar-accent/50 h-12 px-3"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                <Avatar className="h-6 w-6">
                  <AvatarImage
                    src={currentClinic.logo || "/placeholder.svg"}
                    alt={currentClinic.name}
                  />
                  <AvatarFallback className="rounded-lg bg-transparent text-xs font-semibold text-white">
                    {currentClinic.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {currentClinic.name}
                </span>
                <span className="text-muted-foreground truncate text-xs">
                  {currentClinic.plan || "Plano Básico"}
                </span>
              </div>
              <ChevronsUpDownIcon className="text-muted-foreground ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[280px] rounded-lg"
            align="start"
            side="right"
            sideOffset={8}
          >
            <DropdownMenuLabel className="text-muted-foreground px-2 py-1.5 text-xs font-medium">
              Clinics
            </DropdownMenuLabel>
            {clinics.map((clinic, index) => (
              <DropdownMenuItem
                key={clinic.id}
                onClick={() => {
                  onSelectClinic?.(clinic.id);
                  setOpen(false);
                }}
                className="flex cursor-pointer items-center gap-3 px-2 py-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md bg-blue-600 text-white">
                  <Avatar className="h-4 w-4">
                    <AvatarImage
                      src={clinic.logo || "/placeholder.svg"}
                      alt={clinic.name}
                    />
                    <AvatarFallback className="rounded-md bg-transparent text-xs font-semibold text-white">
                      {clinic.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{clinic.name}</div>
                </div>
                <div className="text-muted-foreground flex items-center gap-2 text-xs">
                  <span>⌘{index + 1}</span>
                  {currentClinic.id === clinic.id && (
                    <CheckIcon className="size-4 text-blue-600" />
                  )}
                </div>
              </DropdownMenuItem>
            ))}
            {onAddClinic && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={onAddClinic}
                  className="flex cursor-pointer items-center gap-3 px-2 py-2"
                >
                  <div className="border-muted-foreground/50 flex size-6 items-center justify-center rounded-md border border-dashed">
                    <PlusIcon className="text-muted-foreground size-4" />
                  </div>
                  <div className="text-muted-foreground text-sm font-medium">
                    Add new clinic
                  </div>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
