"use client";

import { ArrowLeft, Loader2 } from "lucide-react";
import type React from "react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { SocialLoginButton } from "./SocialLoginButton";

interface LoginFormProps {
  onLogin: () => void;
  onSwitchToSignup: () => void;
  onSwitchToForgotPassword?: () => void;
}

export function LoginForm({
  onLogin,
  onSwitchToSignup,
  onSwitchToForgotPassword,
}: LoginFormProps) {
  const [step, setStep] = useState<"email" | "password">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setEmailError("");
    setIsLoading(true);

    // Simulate email validation
    setTimeout(() => {
      setIsLoading(false);
      setStep("password");
    }, 1000);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    setPasswordError("");
    setIsLoading(true);

    // Simulate login
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1000);
  };

  const handleBackToEmail = () => {
    setStep("email");
    setPassword("");
    setPasswordError("");
  };

  return (
    <Card className="w-full border-0 shadow-2xl">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-center text-2xl font-semibold">
          Sign in to your account
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {step === "email" ? (
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
                  setEmail(e.target.value);
                  setEmailError("");
                }}
                className={`h-12 ${emailError ? "border-red-500" : ""}`}
                placeholder="Enter your email"
                disabled={isLoading}
              />
              {emailError && (
                <p className="text-sm text-red-500">{emailError}</p>
              )}
            </div>

            <Button
              type="submit"
              className="h-12 w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading || !email}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Continue"
              )}
            </Button>
          </form>
        ) : (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <Button
              type="button"
              variant="ghost"
              onClick={handleBackToEmail}
              className="h-auto p-0 font-normal text-blue-600 hover:text-blue-700"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back
            </Button>

            <div className="space-y-2">
              <Label htmlFor="email-display" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email-display"
                type="email"
                value={email}
                disabled
                className="h-12 bg-gray-50"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <button
                  type="button"
                  onClick={() =>
                    onSwitchToForgotPassword && onSwitchToForgotPassword()
                  }
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Forgot your password?
                </button>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError("");
                }}
                className={`h-12 ${passwordError ? "border-red-500" : ""}`}
                placeholder="Enter your password"
                disabled={isLoading}
              />
              {passwordError && (
                <p className="text-sm text-red-500">{passwordError}</p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <Label htmlFor="remember" className="text-sm">
                Remember me on this device
              </Label>
            </div>

            <Button
              type="submit"
              className="h-12 w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading || !password}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        )}

        {step === "email" && (
          <>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="text-muted-foreground bg-white px-2">Or</span>
              </div>
            </div>

            <div className="space-y-3">
              <SocialLoginButton provider="google" onClick={() => onLogin()} />
              <SocialLoginButton provider="passkey" onClick={() => onLogin()} />
              <SocialLoginButton provider="sso" onClick={() => onLogin()} />
            </div>
          </>
        )}

        <div className="text-center text-sm">
          <span className="text-muted-foreground">
            New to Client Case Credlin?{" "}
          </span>
          <button
            onClick={onSwitchToSignup}
            className="font-medium text-blue-600 hover:text-blue-700"
          >
            Create account
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
