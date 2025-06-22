"use client";

import { Loader2, XIcon } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { useFileUpload } from "@/hooks/use-file-upload";

interface AvatarUploadProps {
  previewUrl: string | null;
  onUpload: (file: File) => void;
  isUploading: boolean;
  label?: string;
  description?: string;
}

export function AvatarUpload({
  previewUrl,
  onUpload,
  isUploading,
  label = "Profile Picture",
  description = "Upload a profile picture to personalize your account.",
}: AvatarUploadProps) {
  const [
    { files, isDragging },
    {
      removeFile,
      openFileDialog,
      getInputProps,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      // clearFiles,
    },
  ] = useFileUpload({ maxSize: 5 * 1024 * 1024, accept: "image/*" });

  const file = files[0]?.file instanceof File ? (files[0].file as File) : null;

  return (
    <div className="flex flex-col items-center space-y-4 sm:flex-row sm:items-start sm:space-y-0 sm:space-x-6">
      <div className="flex flex-col items-center gap-2">
        <div className="relative inline-flex">
          <button
            className="border-input hover:bg-accent/50 data-[dragging=true]:bg-accent/50 focus-visible:border-ring focus-visible:ring-ring/50 relative flex size-16 items-center justify-center overflow-hidden rounded-full border border-dashed transition-colors outline-none focus-visible:ring-[3px] has-disabled:pointer-events-none has-disabled:opacity-50 has-[img]:border-none"
            onClick={openFileDialog}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            data-dragging={isDragging || undefined}
            aria-label={previewUrl ? "Change image" : "Upload image"}
          >
            {previewUrl ? (
              <Image
                className="size-full object-cover"
                src={previewUrl}
                alt="Avatar preview"
                width={64}
                height={64}
                style={{ objectFit: "cover" }}
                unoptimized
              />
            ) : (
              <div aria-hidden="true">
                <Loader2 className="size-4 opacity-60" />
              </div>
            )}
          </button>
          {files.length > 0 && (
            <Button
              onClick={() => removeFile(files[0]?.id)}
              size="icon"
              className="border-background focus-visible:border-background absolute -top-1 -right-1 size-6 rounded-full border-2 shadow-none"
              aria-label="Remove image"
            >
              <XIcon className="size-3.5" />
            </Button>
          )}
          <input
            {...getInputProps()}
            className="sr-only"
            aria-label="Upload image file"
            tabIndex={-1}
          />
        </div>
        {files.length > 0 && file && (
          <Button
            type="button"
            size="sm"
            onClick={() => onUpload(file)}
            disabled={isUploading}
          >
            {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save
          </Button>
        )}
      </div>
      <div className="text-center sm:text-left">
        <h3 className="text-sm font-medium">{label}</h3>
        <p className="text-muted-foreground mt-1 text-sm">{description}</p>
      </div>
    </div>
  );
}
