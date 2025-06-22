"use client";

import { useMutation } from "@tanstack/react-query";

import { createS3Assets } from "@/actions/create-s3-assets";
import { CreateS3AssetInput } from "@/actions/create-s3-assets/schema";

import { AvatarUrlResponse } from "./use-avatar-url";

export function useAvatarUploader({
  onSuccess,
  onError,
}: {
  onSuccess?: (url: string | null) => void;
  onError?: () => void;
}) {
  return useMutation({
    mutationFn: async (data: CreateS3AssetInput) => {
      const result = await createS3Assets(data);
      return result;
    },
    onSuccess: (res: AvatarUrlResponse) => {
      onSuccess?.(res?.data?.url ?? null);
    },
    onError: () => {
      onError?.();
    },
  });
}
