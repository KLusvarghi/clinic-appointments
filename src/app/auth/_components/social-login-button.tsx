"use client";

import { Building, Key } from "lucide-react";

import GoogleIcon from "@/components/icons/google";
import { Button } from "@/components/ui/button";

interface SocialLoginButtonProps {
  provider: "google" | "linkedin" | "sso";
  onClick: () => void;
  text: string;
}

export function SocialLoginButton({
  provider,
  onClick,
  text,
}: SocialLoginButtonProps) {
  const config = {
    google: {
      icon: <GoogleIcon className="h-4 w-4" />,
      text: text,
    },
    linkedin: {
      icon: <Key className="h-4 w-4" />,
      text: text,
    },
    sso: {
      icon: <Building className="h-4 w-4" />,
      text: text,
    },
  }[provider];

  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      className="h-12 w-full justify-center gap-2"
    >
      {config.icon}
      {config.text}
    </Button>
  );
}
