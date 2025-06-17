"use client";

import { CopyIcon, UploadIcon } from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function GeneralSettingsPage() {
  const [orgId] = React.useState("org_krc321iuwrht123rylwelBuda");
  const [displayName, setDisplayName] = React.useState("nivo.video");
  const [orgSlug, setOrgSlug] = React.useState("nivo-video");

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-8 pt-12">
      <div className="space-y-8">
        <div className="space-y-3">
          <div>
            <Label className="text-base font-medium">Organization ID</Label>
            <p className="text-muted-foreground text-sm">
              This is your user ID within Nivo API
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Input
              value={orgId}
              readOnly
              className="bg-muted font-mono text-sm"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(orgId)}
            >
              <CopyIcon className="h-4 w-4" />
              Copy
            </Button>
          </div>
        </div>

        {/* Display Name */}
        <div className="space-y-3">
          <div>
            <Label className="text-base font-medium">Display name</Label>
            <p className="text-muted-foreground text-sm">
              How your organization name is displayed within Nivo.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="max-w-md"
            />
            <Button size="sm">Save</Button>
          </div>
        </div>

        {/* Organization Slug */}
        <div className="space-y-3">
          <div>
            <Label className="text-base font-medium">Organization Slug</Label>
            <p className="text-muted-foreground text-sm">
              The slug displayed on the URL when sharing public links.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <span className="text-muted-foreground mr-1 text-sm">
                nivo.video/
              </span>
              <Input
                value={orgSlug}
                onChange={(e) => setOrgSlug(e.target.value)}
                className="max-w-48"
              />
            </div>
          </div>
        </div>

        {/* Organization Avatar */}
        <div className="space-y-3">
          <div>
            <Label className="text-base font-medium">Organization Avatar</Label>
            <p className="text-muted-foreground text-sm">
              Recommended 400x400px, PNG or JPG
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-lg">
              <UploadIcon className="text-muted-foreground h-6 w-6" />
            </div>
            <Button variant="outline">
              <UploadIcon className="mr-2 h-4 w-4" />
              Select image
            </Button>
          </div>
        </div>

        <Separator />

        {/* Leave Organization */}
        <div className="space-y-3">
          <div>
            <Label className="text-base font-medium">Leave Organization</Label>
            <p className="text-muted-foreground text-sm">
              Once you leave, you&apos;ll lose access to this organization. The
              organization data won&apos;t be deleted.
            </p>
          </div>
          <Button variant="outline" className="text-muted-foreground">
            Leave Organization
          </Button>
        </div>

        <Separator />

        {/* Danger Zone */}
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <Badge variant="destructive" className="text-xs">
                DANGER ZONE
              </Badge>
            </CardTitle>
            <CardDescription>
              <strong>Delete Organization</strong>
              <br />
              All of the organization data will be{" "}
              <strong>permanently deleted</strong>. This action is not
              reversible, so please continue with caution.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive">Delete Organization</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
