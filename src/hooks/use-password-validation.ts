import { useState } from "react";

export type PasswordValidation = {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
};

export function validatePassword(password: string): PasswordValidation {
  return {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };
}

export function isPasswordValid(validation: PasswordValidation) {
  return Object.values(validation).every(Boolean);
}

export function usePasswordValidation() {
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidation>({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  const [showPasswordValidation, setShowPasswordValidation] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: string) => void,
  ) => {
    const value = e.target.value;
    onChange(value);
    setPasswordValidation(validatePassword(value));
    setShowPasswordValidation(value.length > 0);
  };

  const handleFocus = (value: string) => {
    setShowPasswordValidation(!!value);
  };

  const handleBlur = () => {
    setShowPasswordValidation(false);
  };

  return {
    passwordValidation,
    showPasswordValidation,
    handleChange,
    handleFocus,
    handleBlur,
    setShowPasswordValidation,
  };
}
