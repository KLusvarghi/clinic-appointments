"use client";

import { LinkIcon, MoreHorizontalIcon, SearchIcon } from "lucide-react";
import * as React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageContainer, PageContent } from "@/components/ui/page-container";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const members = [
  {
    id: "1",
    name: "Diego Fernandes",
    email: "diego@nivo.video",
    role: "Owner",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "2",
    name: "John Doe",
    email: "john@nivo.video",
    role: "Member",
    avatar: "/placeholder.svg?height=32&width=32",
  },
];

export default function MembersSettingsPage() {
  const [inviteEmail, setInviteEmail] = React.useState("john.doe@acme.com");
  const [selectedMembers, setSelectedMembers] = React.useState<string[]>([]);

  const handleSelectAll = () => {
    if (selectedMembers.length === members.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(members.map((m) => m.id));
    }
  };

  const handleSelectMember = (memberId: string) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId],
    );
  };

  return (
    <PageContainer>
      <PageContent>
        {/* Invite Member */}
        <div className="space-y-4">
          <div>
            <Label className="text-base font-medium">Invite member</Label>
            <p className="text-muted-foreground text-sm">
              Invite new members by email address
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="max-w-md flex-1">
              <Label htmlFor="email" className="sr-only">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            <div className="min-w-24">
              <Label className="sr-only">Role</Label>
              <Badge variant="secondary">Member</Badge>
            </div>
            <Button>Send Invite</Button>
          </div>
          <Button variant="link" className="h-auto p-0 text-sm">
            <LinkIcon className="mr-1 h-4 w-4" />
            Invite Link
          </Button>
        </div>

        <Separator />

        {/* Members List */}
        <div className="space-y-4">
          <Tabs defaultValue="members" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="members">
                Organization Members (12)
              </TabsTrigger>
              <TabsTrigger value="pending">Pending Invites (3)</TabsTrigger>
            </TabsList>

            <TabsContent value="members" className="space-y-4">
              {/* Search and Actions */}
              <div className="flex items-center justify-between">
                <div className="relative max-w-sm">
                  <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                  <Input placeholder="Search for members" className="pl-10" />
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    All roles
                  </Button>
                </div>
              </div>

              {/* Select All */}
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={selectedMembers.length === members.length}
                  onCheckedChange={handleSelectAll}
                />
                <Label className="text-sm">Select all ({members.length})</Label>
              </div>

              {/* Members */}
              <div className="space-y-3">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-4 rounded-lg border p-3"
                  >
                    <Checkbox
                      checked={selectedMembers.includes(member.id)}
                      onCheckedChange={() => handleSelectMember(member.id)}
                    />
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={member.avatar || "/placeholder.svg"}
                        alt={member.name}
                      />
                      <AvatarFallback>
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium">{member.name}</div>
                      <div className="text-muted-foreground text-sm">
                        {member.email}
                      </div>
                    </div>
                    <Badge
                      variant={
                        member.role === "Owner" ? "default" : "secondary"
                      }
                    >
                      {member.role}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontalIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit role</DropdownMenuItem>
                        <DropdownMenuItem>Remove member</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="pending">
              <div className="text-muted-foreground py-8 text-center">
                No pending invites
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </PageContent>
    </PageContainer>
  );
}
