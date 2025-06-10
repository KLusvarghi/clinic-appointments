"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Loader2, Mail, Check, Eye, EyeOff } from "lucide-react"

interface ForgotPasswordFormProps {
  onBackToLogin: () => void
  onPasswordReset: () => void
}

type Step = "email" | "email-sent" | "reset-password" | "success"

interface PasswordValidation {
  minLength: boolean
  hasUppercase: boolean
  hasLowercase: boolean
  hasNumber: boolean
  hasSpecialChar: boolean
}

export function ForgotPasswordForm({ onBackToLogin, onPasswordReset }: ForgotPasswordFormProps) {
  const [step, setStep] = useState<Step>("email")
  const [email, setEmail] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [confirmPasswordError, setConfirmPasswordError] = useState("")
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidation>({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false,
  })

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
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

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address")
      return
    }

    setEmailError("")
    setIsLoading(true)

    // Simulate sending reset email
    setTimeout(() => {
      setIsLoading(false)
      setStep("email-sent")
    }, 1500)
  }

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()

    let hasErrors = false

    if (!isPasswordValid(passwordValidation)) {
      setPasswordError("Password does not meet all requirements")
      hasErrors = true
    } else {
      setPasswordError("")
    }

    if (newPassword !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match")
      hasErrors = true
    } else {
      setConfirmPasswordError("")
    }

    if (hasErrors) return

    setIsLoading(true)

    // Simulate password reset
    setTimeout(() => {
      setIsLoading(false)
      setStep("success")
    }, 1500)
  }

  const handlePasswordChange = (password: string) => {
    setNewPassword(password)
    const validation = validatePassword(password)
    setPasswordValidation(validation)
    setPasswordError("")
  }

  const handleConfirmPasswordChange = (password: string) => {
    setConfirmPassword(password)
    setConfirmPasswordError("")
  }

  const handleContinueToLogin = () => {
    setTimeout(() => {
      onPasswordReset()
    }, 500)
  }

  // Simulate clicking reset link from email
  const handleSimulateEmailLink = () => {
    setStep("reset-password")
  }

  const passwordMeetsRequirements = isPasswordValid(passwordValidation)

  return (
    <Card className="w-full shadow-2xl border-0">
      <CardHeader className="space-y-1 pb-6">
        {step !== "success" && (
          <Button
            type="button"
            variant="ghost"
            onClick={onBackToLogin}
            className="self-start p-0 h-auto font-normal text-blue-600 hover:text-blue-700 mb-2"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to sign in
          </Button>
        )}

        <CardTitle className="text-2xl font-semibold text-center">
          {step === "email" && "Reset your password"}
          {step === "email-sent" && "Check your email"}
          {step === "reset-password" && "Create new password"}
          {step === "success" && "Password reset successful"}
        </CardTitle>

        {step === "email" && (
          <p className="text-center text-muted-foreground">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Step 1: Email Input */}
        {step === "email" && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setEmailError("")
                }}
                className={`h-12 ${emailError ? "border-red-500" : ""}`}
                placeholder="Enter your email address"
                disabled={isLoading}
              />
              {emailError && <p className="text-sm text-red-500">{emailError}</p>}
            </div>

            <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700" disabled={isLoading || !email}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending reset link...
                </>
              ) : (
                "Send reset link"
              )}
            </Button>
          </form>
        )}

        {/* Step 2: Email Sent Confirmation */}
        {step === "email-sent" && (
          <div className="text-center space-y-6">
            <div className="mx-auto h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
              <Mail className="h-8 w-8 text-blue-600" />
            </div>

            <div className="space-y-2">
              <p className="text-muted-foreground">We've sent a password reset link to:</p>
              <p className="font-medium text-lg">{email}</p>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Click the link in the email to reset your password. If you don't see the email, check your spam folder.
              </p>

              {/* Demo button to simulate clicking email link */}
              <div className="border-t pt-4">
                <p className="text-xs text-muted-foreground mb-2">For demo purposes:</p>
                <Button onClick={handleSimulateEmailLink} variant="outline" className="w-full h-10">
                  Simulate clicking email link
                </Button>
              </div>
            </div>

            <Button onClick={() => setStep("email")} variant="ghost" className="text-blue-600 hover:text-blue-700">
              Try a different email address
            </Button>
          </div>
        )}

        {/* Step 3: Reset Password Form */}
        {step === "reset-password" && (
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email-display" className="text-sm font-medium">
                Email
              </Label>
              <Input id="email-display" type="email" value={email} disabled className="h-12 bg-gray-50" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password" className="text-sm font-medium">
                New password
              </Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  className={`h-12 pr-10 ${passwordError ? "border-red-500" : passwordMeetsRequirements && newPassword ? "border-green-500" : ""}`}
                  placeholder="Enter your new password"
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>

              {newPassword && (
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
                            <span className="h-3 w-3 mr-2">•</span>
                          )}
                          8 or more characters
                        </div>
                        <div
                          className={`flex items-center ${passwordValidation.hasUppercase ? "text-green-600" : "text-gray-500"}`}
                        >
                          {passwordValidation.hasUppercase ? (
                            <Check className="h-3 w-3 mr-2" />
                          ) : (
                            <span className="h-3 w-3 mr-2">•</span>
                          )}
                          Uppercase letter
                        </div>
                        <div
                          className={`flex items-center ${passwordValidation.hasLowercase ? "text-green-600" : "text-gray-500"}`}
                        >
                          {passwordValidation.hasLowercase ? (
                            <Check className="h-3 w-3 mr-2" />
                          ) : (
                            <span className="h-3 w-3 mr-2">•</span>
                          )}
                          Lowercase letter
                        </div>
                        <div
                          className={`flex items-center ${passwordValidation.hasNumber ? "text-green-600" : "text-gray-500"}`}
                        >
                          {passwordValidation.hasNumber ? (
                            <Check className="h-3 w-3 mr-2" />
                          ) : (
                            <span className="h-3 w-3 mr-2">•</span>
                          )}
                          Number
                        </div>
                        <div
                          className={`flex items-center ${passwordValidation.hasSpecialChar ? "text-green-600" : "text-gray-500"}`}
                        >
                          {passwordValidation.hasSpecialChar ? (
                            <Check className="h-3 w-3 mr-2" />
                          ) : (
                            <span className="h-3 w-3 mr-2">•</span>
                          )}
                          Special character
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-sm font-medium">
                Confirm new password
              </Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                  className={`h-12 pr-10 ${confirmPasswordError ? "border-red-500" : confirmPassword && newPassword === confirmPassword ? "border-green-500" : ""}`}
                  placeholder="Confirm your new password"
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
              {confirmPasswordError && <p className="text-sm text-red-500">{confirmPasswordError}</p>}
              {confirmPassword && newPassword === confirmPassword && (
                <p className="text-sm text-green-600 flex items-center">
                  <Check className="h-3 w-3 mr-1" />
                  Passwords match
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-blue-600 hover:bg-blue-700"
              disabled={isLoading || !passwordMeetsRequirements || newPassword !== confirmPassword}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting password...
                </>
              ) : (
                "Reset password"
              )}
            </Button>
          </form>
        )}

        {/* Step 4: Success */}
        {step === "success" && (
          <div className="text-center space-y-6">
            <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="h-8 w-8 text-green-600" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Password reset successfully!</h3>
              <p className="text-muted-foreground">
                Your password has been updated. You can now sign in with your new password.
              </p>
            </div>

            <Button onClick={handleContinueToLogin} className="w-full h-12 bg-blue-600 hover:bg-blue-700">
              Continue to sign in
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
