"use client";

import { useEffect, useState } from "react";

import { getAvatarUrlAction } from "@/actions/get-avatar-url";
import { OwnerType } from "@/types/assets-avatar";

export type AvatarUrlResponse = Awaited<ReturnType<typeof getAvatarUrlAction>>;

interface UseAvatarUrlProps {
  userId: string | null;
  ownerType: OwnerType;
  refreshKey?: number;
}

export function useAvatarUrl({
  userId,
  ownerType,
  refreshKey = 0,
}: UseAvatarUrlProps) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    getAvatarUrlAction({ ownerId: userId, ownerType: ownerType })
      .then((res: AvatarUrlResponse) => setUrl(res?.data?.url ?? null))
      .catch(() => setUrl(null));
  }, [userId, ownerType, refreshKey]);

  return url;
}
