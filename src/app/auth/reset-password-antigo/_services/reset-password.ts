import { ResetPasswordFormData } from "../_types/schema";

export class ResetPasswordError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ResetPasswordError";
  }
}

export async function resetPassword(data: ResetPasswordFormData): Promise<void> {
  try {
    const response = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new ResetPasswordError(error.message || "Failed to reset password");
    }
  } catch (error) {
    if (error instanceof ResetPasswordError) {
      throw error;
    }
    throw new ResetPasswordError("An unexpected error occurred");
  }
} 