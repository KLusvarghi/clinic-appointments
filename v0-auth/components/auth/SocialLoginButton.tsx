"use client"

import { Button } from "@/components/ui/button"
import { Chrome, Key, Building } from "lucide-react"

interface SocialLoginButtonProps {
  provider: "google" | "passkey" | "sso"
  onClick: () => void
}

export function SocialLoginButton({ provider, onClick }: SocialLoginButtonProps) {
  const getButtonConfig = () => {
    switch (provider) {
      case "google":
        return {
          icon: <Chrome className="h-4 w-4" />,
          text: "Sign in with Google",
          variant: "outline" as const,
        }
      case "passkey":
        return {
          icon: <Key className="h-4 w-4" />,
          text: "Sign in with passkey",
          variant: "outline" as const,
        }
      case "sso":
        return {
          icon: <Building className="h-4 w-4" />,
          text: "Sign in with SSO",
          variant: "outline" as const,
        }
    }
  }

  const config = getButtonConfig()

  return (
    <Button type="button" variant={config.variant} onClick={onClick} className="w-full h-12 justify-center gap-2">
      {config.icon}
      {config.text}
    </Button>
  )
}
