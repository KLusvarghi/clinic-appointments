import { Check, X } from "lucide-react";

import { PasswordValidation } from "@/hooks/use-password-validation";

interface PasswordRequirementsProps {
  validation: PasswordValidation;
}

export function PasswordRequirements({ validation }: PasswordRequirementsProps) {
  return (
    <div className="mt-2 space-y-1 rounded-md bg-gray-50 p-3">
      <div className="text-sm text-gray-600">
        <p className="mb-2">Your password must contain:</p>
        <div className="space-y-1">
          <div className={`flex items-center ${validation.minLength ? "text-green-600" : "text-gray-500"}`}>
            {validation.minLength ? (
              <Check className="mr-2 h-3 w-3" />
            ) : (
              <X className="mr-2 h-3 w-3" />
            )}
            8 or more characters
          </div>
          <div className={`flex items-center ${validation.hasUppercase ? "text-green-600" : "text-gray-500"}`}>
            {validation.hasUppercase ? (
              <Check className="mr-2 h-3 w-3" />
            ) : (
              <X className="mr-2 h-3 w-3" />
            )}
            Uppercase letter
          </div>
          <div className={`flex items-center ${validation.hasLowercase ? "text-green-600" : "text-gray-500"}`}>
            {validation.hasLowercase ? (
              <Check className="mr-2 h-3 w-3" />
            ) : (
              <X className="mr-2 h-3 w-3" />
            )}
            Lowercase letter
          </div>
          <div className={`flex items-center ${validation.hasNumber ? "text-green-600" : "text-gray-500"}`}>
            {validation.hasNumber ? (
              <Check className="mr-2 h-3 w-3" />
            ) : (
              <X className="mr-2 h-3 w-3" />
            )}
            Number
          </div>
          <div className={`flex items-center ${validation.hasSpecialChar ? "text-green-600" : "text-gray-500"}`}>
            {validation.hasSpecialChar ? (
              <Check className="mr-2 h-3 w-3" />
            ) : (
              <X className="mr-2 h-3 w-3" />
            )}
            Special character
          </div>
        </div>
      </div>
    </div>
  );
}
