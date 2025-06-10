"use client";

import { Building,Chrome, Key } from "lucide-react";

import { Button } from "@/components/ui/button";

interface SocialLoginButtonProps {
  provider: "google" | "passkey" | "sso";
  onClick: () => void;
}

export function AlphSocialLoginButton({ provider, onClick }: SocialLoginButtonProps) {
  const config = {
    google: {
      icon: <Chrome className="h-4 w-4" />, text: "Sign in with Google",
    },
    passkey: {
      icon: <Key className="h-4 w-4" />, text: "Sign in with passkey",
    },
    sso: {
      icon: <Building className="h-4 w-4" />, text: "Sign in with SSO",
    },
  }[provider];

  return (
    <Button type="button" variant="outline" onClick={onClick} className="w-full h-12 justify-center gap-2">
      {config.icon}
      {config.text}
    </Button>
  );
}
