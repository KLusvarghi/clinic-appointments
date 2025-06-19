"use client";

import { VisibilityState } from "@tanstack/react-table";
import { Columns3Icon, FilterIcon, Plus } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/components/ui/data-table";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Member } from "../_types";
import { getUsersTableColumns } from "./get-users-table-columns";
import UpsertUserForm from "./upsert-user-form";

interface UsersTableProps {
  activeMembers: Member[];
  // inactiveMembers: Member[];
  userId: string | null;
}

export default function UsersTable({ activeMembers, userId }: UsersTableProps) {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filteredMembers, setFilteredMembers] = useState(activeMembers);
  const [selectedEmailVerificated, setSelectedeEmailVerificated] = useState<
    string[]
  >([]);
  const [columnVisibility, setColumnVisibility] = useState<
    Record<string, boolean>
  >({});

  const columns = useMemo(
    () =>
      getUsersTableColumns(userId ?? null, {
        onDelete: (idToDelete: string) => {
          setFilteredMembers((prev) =>
            prev.filter((member) => member.user?.id !== idToDelete),
          );
        },
      }),
    [userId],
  );

  const EmailCounts = useMemo(() => {
    const counts = new Map<string, number>();
    activeMembers.forEach((member) => {
      const email = member.user?.emailVerified ? "Verificated" : "Unverified";
      counts.set(email, (counts.get(email) || 0) + 1);
    });
    return counts;
  }, [activeMembers]);

  const uniqueEmailValues = useMemo(() => {
    return Array.from(EmailCounts.keys());
  }, [EmailCounts]);

  const handleEmailChange = (checked: boolean, value: string) => {
    setSelectedeEmailVerificated((prev) =>
      checked ? [...prev, value] : prev.filter((v) => v !== value),
    );
  };

  const filtered = filteredMembers.filter((m) => {
    const term = search.toLowerCase();
    const email = m.user?.emailVerified ? "Verificated" : "Unverified";

    const matchesSearch =
      m.user?.name?.toLowerCase().includes(term) ||
      m.user?.email?.toLowerCase().includes(term) ||
      m.role?.toLowerCase().includes(term);

    const matchesStatus =
      selectedEmailVerificated.length === 0 ||
      selectedEmailVerificated.includes(email);

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Buscar usuários..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />

          {/* Filter by Verified email */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <FilterIcon
                  className="-ms-1 opacity-60"
                  size={16}
                  aria-hidden="true"
                />
                Verified Email
                {selectedEmailVerificated.length > 0 && (
                  <span className="bg-background text-muted-foreground/70 -me-1 inline-flex h-5 items-center rounded border px-1 text-[0.625rem] font-medium">
                    {selectedEmailVerificated.length}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto min-w-36 p-3" align="start">
              <div className="space-y-3">
                <div className="text-muted-foreground text-xs font-medium">
                  Filters
                </div>
                <div className="space-y-3">
                  {uniqueEmailValues.map((value, i) => (
                    <div key={value} className="flex items-center gap-2">
                      <Checkbox
                        id={`status-${i}`}
                        checked={selectedEmailVerificated.includes(value)}
                        onCheckedChange={(checked: boolean) =>
                          handleEmailChange(checked, value)
                        }
                      />
                      <Label
                        htmlFor={`status-${i}`}
                        className="flex grow justify-between gap-2 font-normal"
                      >
                        {value}
                        <span className="text-muted-foreground ms-2 text-xs">
                          {EmailCounts.get(value)}
                        </span>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
          {/* view */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Columns3Icon
                  className="-ms-1 opacity-60"
                  size={16}
                  aria-hidden="true"
                />
                View
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto min-w-36 p-3" align="end">
              <div className="space-y-3">
                <div className="text-muted-foreground text-xs font-medium">
                  Toggle columns
                </div>
                <div className="space-y-2">
                  {columns
                    .filter((col) => col.id && col.enableHiding !== false)
                    .map((col) => (
                      <div key={col.id} className="flex items-center gap-2">
                        <Checkbox
                          id={`col-${col.id}`}
                          checked={columnVisibility[col.id!] !== false}
                          onCheckedChange={(checked: boolean) => {
                            setColumnVisibility((prev) => ({
                              ...prev,
                              [col.id as keyof VisibilityState]: checked,
                            }));
                          }}
                        />
                        <Label htmlFor={`col-${col.id}`} className="capitalize">
                          {col.header as string}
                        </Label>
                      </div>
                    ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add user
            </Button>
          </DialogTrigger>
          <UpsertUserForm isOpen={isOpen} onSuccess={() => setIsOpen(false)} />
        </Dialog>
      </div>
      <DataTable
        data={filtered}
        columns={columns}
        columnVisibility={columnVisibility}
      />
    </div>
  );
}
