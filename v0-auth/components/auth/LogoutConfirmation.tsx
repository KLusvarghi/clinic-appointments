"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, LogOut } from "lucide-react"

interface LogoutConfirmationProps {
  onLogout: () => void
  onCancel: () => void
}

export function LogoutConfirmation({ onLogout, onCancel }: LogoutConfirmationProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)

    // Simulate logout process
    setTimeout(() => {
      setIsLoading(false)
      onLogout()
    }, 1000)
  }

  return (
    <Card className="w-full shadow-2xl border-0">
      <CardHeader className="space-y-1 pb-6 text-center">
        <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
          <LogOut className="h-6 w-6 text-red-600" />
        </div>
        <CardTitle className="text-2xl font-semibold">Sign out of your account</CardTitle>
        <p className="text-muted-foreground">
          Are you sure you want to sign out? You'll need to sign in again to access your account.
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <Button onClick={handleLogout} className="w-full h-12 bg-red-600 hover:bg-red-700" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing out...
            </>
          ) : (
            "Sign out"
          )}
        </Button>

        <Button variant="outline" onClick={onCancel} className="w-full h-12" disabled={isLoading}>
          Cancel
        </Button>
      </CardContent>
    </Card>
  )
}
