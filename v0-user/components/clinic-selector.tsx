"use client"

import * as React from "react"
import { CheckIcon, ChevronsUpDownIcon, PlusIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"

interface Clinic {
  id: string
  name: string
  logo?: string
  plan?: string
}

interface ClinicSelectorProps {
  clinics: Clinic[]
  selectedClinic?: Clinic
  onSelectClinic?: (clinic: Clinic) => void
  onAddClinic?: () => void
}

export function ClinicSelector({ clinics, selectedClinic, onSelectClinic, onAddClinic }: ClinicSelectorProps) {
  const [open, setOpen] = React.useState(false)

  // If no clinics exist, show just the name and image without dropdown
  if (!clinics || clinics.length === 0) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            className="h-12 px-3 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-600 text-white">
              <span className="text-sm font-semibold">NC</span>
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">Nenhuma Clínica</span>
              <span className="truncate text-xs text-muted-foreground">Adicione uma clínica</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  const currentClinic = selectedClinic || clinics[0]

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="h-12 px-3 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-sidebar-accent/50"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={currentClinic.logo || "/placeholder.svg"} alt={currentClinic.name} />
                  <AvatarFallback className="rounded-lg bg-transparent text-white text-xs font-semibold">
                    {currentClinic.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{currentClinic.name}</span>
                <span className="truncate text-xs text-muted-foreground">{currentClinic.plan || "Plano Básico"}</span>
              </div>
              <ChevronsUpDownIcon className="ml-auto size-4 text-muted-foreground" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[280px] rounded-lg" align="start" side="right" sideOffset={8}>
            <DropdownMenuLabel className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
              Clínicas
            </DropdownMenuLabel>
            {clinics.map((clinic, index) => (
              <DropdownMenuItem
                key={clinic.id}
                onClick={() => {
                  onSelectClinic?.(clinic)
                  setOpen(false)
                }}
                className="flex items-center gap-3 px-2 py-2 cursor-pointer"
              >
                <div className="flex size-6 items-center justify-center rounded-md bg-blue-600 text-white">
                  <Avatar className="h-4 w-4">
                    <AvatarImage src={clinic.logo || "/placeholder.svg"} alt={clinic.name} />
                    <AvatarFallback className="rounded-md bg-transparent text-white text-xs font-semibold">
                      {clinic.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{clinic.name}</div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>⌘{index + 1}</span>
                  {currentClinic.id === clinic.id && <CheckIcon className="size-4 text-blue-600" />}
                </div>
              </DropdownMenuItem>
            ))}
            {onAddClinic && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onAddClinic} className="flex items-center gap-3 px-2 py-2 cursor-pointer">
                  <div className="flex size-6 items-center justify-center rounded-md border border-dashed border-muted-foreground/50">
                    <PlusIcon className="size-4 text-muted-foreground" />
                  </div>
                  <div className="font-medium text-sm text-muted-foreground">Adicionar clínica</div>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
