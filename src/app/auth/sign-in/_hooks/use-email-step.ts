/* hooks/useEmailStep.ts */
import { useState } from "react";

export const useEmailStep = () => {
  const [step, setStep] = useState<"email" | "password">("email");
  const [email, setEmail] = useState("");

  const toPassword = () => setStep("password");
  const toEmail = () => setStep("email");

  return { step, toPassword, toEmail, email, setEmail };
};
