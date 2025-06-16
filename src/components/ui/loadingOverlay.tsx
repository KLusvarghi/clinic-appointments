"use client";

import { Loader2 } from "lucide-react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface LoadingOverlayProps {
  /** Texto principal exibido no loading */
  message?: string;
  /** Texto secundário opcional */
  subMessage?: string;
}

export function LoadingOverlay({
  message = "Carregando…",
  subMessage = "",
}: LoadingOverlayProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={message}
      className="fixed inset-0 z-50 grid place-items-center"
    >
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* conteúdo do loading */}
      <Card className="animate-in fade-in zoom-in-95 relative z-10 min-w-[280px]">
        <CardHeader className="items-center space-y-3">
          <Loader2
            aria-hidden="true"
            className="text-primary h-8 w-8 animate-spin"
          />
          <CardTitle className="text-center text-lg">{message}</CardTitle>
          <CardDescription className="text-center">
            {subMessage}
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}

{
  /* Inner spinning icon */
}
{
  /* <div className="absolute inset-0 flex items-center justify-center">
  <Loader2
    className="h-6 w-6 animate-spin text-blue-600"
    style={{ animationDirection: "reverse" }}
  />
</div> */
}
