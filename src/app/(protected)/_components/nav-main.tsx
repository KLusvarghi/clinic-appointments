"use client";

import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

export type NavLinkItem = {
  type: "link";
  title: string;
  url: string;
  icon: LucideIcon;
};

export type NavGroupItem = {
  type: "group";
  title: string;
  icon: LucideIcon;
  defaultOpen?: boolean;
  children: NavLinkItem[];
};

export type NavItem = NavLinkItem | NavGroupItem;

interface NavMainProps {
  items: ReadonlyArray<NavItem>;
}

export function NavMain({ items }: NavMainProps) {
  const pathname = usePathname();

  const isGroupActive = (group: NavGroupItem) =>
    group.children.some((child) => pathname === child.url);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Main menu</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            if (item.type === "link") {
              const { title, url, icon: Icon } = item;
              return (
                <SidebarMenuItem key={title}>
                  <SidebarMenuButton asChild isActive={pathname === url}>
                    <Link href={url} prefetch>
                      <Icon />
                      <span>{title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            }

            // item.type === "group" → Collapsible
            const { title, icon: Icon, children, defaultOpen } = item;
            return (
              <Collapsible
                key={title}
                defaultOpen={defaultOpen}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton asChild isActive={isGroupActive(item)}>
                      {/* botao do grupo não navega */}
                      <button
                        type="button"
                        className="flex w-full items-center gap-2 text-left"
                      >
                        <Icon />
                        <span>{title}</span>
                      </button>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {children.map(
                        ({ title: childTitle, url, icon: ChildIcon }) => (
                          <SidebarMenuSubItem key={childTitle}>
                            <SidebarMenuButton
                              asChild
                              isActive={pathname === url}
                            >
                              <Link href={url} prefetch>
                                <ChildIcon />
                                <span>{childTitle}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuSubItem>
                        ),
                      )}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
