"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

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
  useSidebar,
} from "@/components/ui/sidebar";

// ---------------------------------------------------------------------------
// Types ---------------------------------------------------------------------
// ---------------------------------------------------------------------------

export interface Clinic {
  id: string;
  name: string;
}

export interface UserSession {
  user?: {
    email?: string;
    image?: string | null;
    name?: string;
  };
}

interface NavUserProps {
  session?: UserSession | null;
  onSignOut: () => void;
}

// ---------------------------------------------------------------------------
// Component -----------------------------------------------------------------
// ---------------------------------------------------------------------------

export function NavUser({ session, onSignOut }: NavUserProps) {
  const { isMobile } = useSidebar();
  const router = useRouter();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={session?.user?.image}
                  alt={session?.user?.name}
                />
                <AvatarFallback className="rounded-lg">
                  {session?.user?.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{session?.user?.name}</p>
                <p className="text-muted-foreground text-sm">
                  {session?.user?.email}
                </p>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={session?.user?.image}
                    alt={session?.user?.name}
                  />
                  <AvatarFallback className="rounded-lg">
                    {session?.user?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {session?.user?.name}
                  </span>
                  <span className="text-muted-foreground truncate text-xs">
                    {session?.user?.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => {
                router.push("/profile");
              }}
            >
              Profile
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                router.push("/notifications");
              }}
            >
              Notifications
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={onSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
