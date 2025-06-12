"use client";

import { useState } from "react";

import { SignInForm } from "@/app/auth/_components/sign-in-form";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { LoginForm } from "@/components/auth/LoginForm";
import { LogoutConfirmation } from "@/components/auth/LogoutConfirmation";
import { SignUpForm } from "@/components/auth/SignUpForm";

export default function AuthPage() {
  const [currentView, setCurrentView] = useState<
    "login" | "signup" | "logout" | "forgot-password"
  >("login");

  const handleLogin = () => {
    setCurrentView("logout");
  };

  const handleLogout = () => {
    setCurrentView("login");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-400 via-purple-500 to-orange-400 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-white">Client Case Credlin</h1>
        </div>

        {/* Auth Forms */}
        {currentView === "login" && (
          <SignInForm onSwitchToSignup={() => setCurrentView("signup")} />
        )}

        {currentView === "signup" && (
          <SignUpForm
            onSignup={handleLogin}
            onSwitchToLogin={() => setCurrentView("login")}
          />
        )}

        {currentView === "logout" && (
          <LogoutConfirmation
            onLogout={handleLogout}
            onCancel={() => setCurrentView("login")}
          />
        )}

        {currentView === "forgot-password" && (
          <ForgotPasswordForm
            onBackToLogin={() => setCurrentView("login")}
            onPasswordReset={() => setCurrentView("login")}
          />
        )}

        {/* Footer */}
        <div className="mt-8 space-x-4 text-center text-sm text-white/70">
          <span>© Client Case Credlin</span>
          <span>Privacy & terms</span>
        </div>
      </div>
    </div>
  );
}
