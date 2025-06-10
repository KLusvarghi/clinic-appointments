"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SocialLoginButton } from "./SocialLoginButton"
import { Loader2, Check, X } from "lucide-react"

interface SignUpFormProps {
  onSignup: () => void
  onSwitchToLogin: () => void
}

interface PasswordValidation {
  minLength: boolean
  hasUppercase: boolean
  hasLowercase: boolean
  hasNumber: boolean
  hasSpecialChar: boolean
}

export function SignUpForm({ onSignup, onSwitchToLogin }: SignUpFormProps) {
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    password: "",
    country: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidation>({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false,
  })
  const [showPasswordValidation, setShowPasswordValidation] = useState(false)

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateFullName = (name: string) => {
    return name.trim().split(" ").length >= 2 && name.trim().length >= 3
  }

  const validatePassword = (password: string): PasswordValidation => {
    return {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    }
  }

  const isPasswordValid = (validation: PasswordValidation) => {
    return Object.values(validation).every(Boolean)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }

    // Real-time password validation
    if (field === "password") {
      const validation = validatePassword(value)
      setPasswordValidation(validation)
      setShowPasswordValidation(value.length > 0)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: Record<string, string> = {}

    if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!validateFullName(formData.fullName)) {
      newErrors.fullName = "Please enter your full name (first and last name)"
    }

    if (!isPasswordValid(passwordValidation)) {
      newErrors.password = "Password does not meet all requirements"
    }

    if (!formData.country) {
      newErrors.country = "Please select your country"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)

    // Simulate signup
    setTimeout(() => {
      setIsLoading(false)
      onSignup()
    }, 1500)
  }

  const passwordMeetsRequirements = isPasswordValid(passwordValidation)

  return (
    <Card className="w-full shadow-2xl border-0">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-2xl font-semibold text-center">Create your Client Case Credlin account</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={`h-12 ${errors.email ? "border-red-500" : ""}`}
              placeholder="Enter your email"
              disabled={isLoading}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-sm font-medium">
              Full name
            </Label>
            <Input
              id="fullName"
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              className={`h-12 ${errors.fullName ? "border-red-500" : ""}`}
              placeholder="Enter your full name"
              disabled={isLoading}
            />
            {errors.fullName && <p className="text-sm text-red-500">{errors.fullName}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className={`h-12 ${errors.password ? "border-red-500" : passwordMeetsRequirements && formData.password ? "border-green-500" : ""}`}
              placeholder="Create a password"
              disabled={isLoading}
            />

            {showPasswordValidation && (
              <div className="mt-2 p-3 bg-gray-50 rounded-md space-y-1">
                {passwordMeetsRequirements ? (
                  <div className="flex items-center text-green-600 text-sm">
                    <Check className="h-4 w-4 mr-2" />
                    Your password meets all the necessary requirements.
                  </div>
                ) : (
                  <div className="text-sm text-gray-600">
                    <p className="mb-2">Your password must contain:</p>
                    <div className="space-y-1">
                      <div
                        className={`flex items-center ${passwordValidation.minLength ? "text-green-600" : "text-gray-500"}`}
                      >
                        {passwordValidation.minLength ? (
                          <Check className="h-3 w-3 mr-2" />
                        ) : (
                          <X className="h-3 w-3 mr-2" />
                        )}
                        8 or more characters
                      </div>
                      <div
                        className={`flex items-center ${passwordValidation.hasUppercase ? "text-green-600" : "text-gray-500"}`}
                      >
                        {passwordValidation.hasUppercase ? (
                          <Check className="h-3 w-3 mr-2" />
                        ) : (
                          <X className="h-3 w-3 mr-2" />
                        )}
                        Uppercase letter
                      </div>
                      <div
                        className={`flex items-center ${passwordValidation.hasLowercase ? "text-green-600" : "text-gray-500"}`}
                      >
                        {passwordValidation.hasLowercase ? (
                          <Check className="h-3 w-3 mr-2" />
                        ) : (
                          <X className="h-3 w-3 mr-2" />
                        )}
                        Lowercase letter
                      </div>
                      <div
                        className={`flex items-center ${passwordValidation.hasNumber ? "text-green-600" : "text-gray-500"}`}
                      >
                        {passwordValidation.hasNumber ? (
                          <Check className="h-3 w-3 mr-2" />
                        ) : (
                          <X className="h-3 w-3 mr-2" />
                        )}
                        Number
                      </div>
                      <div
                        className={`flex items-center ${passwordValidation.hasSpecialChar ? "text-green-600" : "text-gray-500"}`}
                      >
                        {passwordValidation.hasSpecialChar ? (
                          <Check className="h-3 w-3 mr-2" />
                        ) : (
                          <X className="h-3 w-3 mr-2" />
                        )}
                        Special character
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="country" className="text-sm font-medium">
              Country
            </Label>
            <Select value={formData.country} onValueChange={(value) => handleInputChange("country", value)}>
              <SelectTrigger className={`h-12 ${errors.country ? "border-red-500" : ""}`}>
                <SelectValue placeholder="Select your country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="br">🇧🇷 Brazil</SelectItem>
                <SelectItem value="us">🇺🇸 United States</SelectItem>
                <SelectItem value="ca">🇨🇦 Canada</SelectItem>
                <SelectItem value="uk">🇬🇧 United Kingdom</SelectItem>
                <SelectItem value="de">🇩🇪 Germany</SelectItem>
                <SelectItem value="fr">🇫🇷 France</SelectItem>
                <SelectItem value="es">🇪🇸 Spain</SelectItem>
                <SelectItem value="it">🇮🇹 Italy</SelectItem>
                <SelectItem value="au">🇦🇺 Australia</SelectItem>
                <SelectItem value="jp">🇯🇵 Japan</SelectItem>
              </SelectContent>
            </Select>
            {errors.country && <p className="text-sm text-red-500">{errors.country}</p>}
          </div>

          <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-muted-foreground">Or</span>
          </div>
        </div>

        <SocialLoginButton provider="google" onClick={() => onSignup()} />

        <div className="text-center text-sm">
          <span className="text-muted-foreground">Already have an account? </span>
          <button onClick={onSwitchToLogin} className="text-blue-600 hover:text-blue-700 font-medium">
            Sign in
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
