"use client";

// import { Loader2 } from "lucide-react";

interface LoadingOverlayProps {
  message?: string;
}

function LoadingOverlay({ message = "Loading..." }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-xs" />

      {/* Loading Content */}
      <div className="relative z-10 flex min-w-[280px] flex-col items-center justify-center space-y-4 rounded-lg border-0 bg-white p-8 shadow-2xl">
        <div className="relative">
          {/* Outer spinning ring */}
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>

          {/* Inner spinning icon */}
          {/* <div className="absolute inset-0 flex items-center justify-center">
            <Loader2
              className="h-6 w-6 animate-spin text-blue-600"
              style={{ animationDirection: "reverse" }}
            />
          </div> */}
        </div>

        <div className="space-y-2 text-center">
          <p className="text-lg font-medium text-gray-900">{message}</p>
          <p className="text-sm text-gray-500">Please wait a moment...</p>
        </div>
      </div>
    </div>
  );
}

export { LoadingOverlay };
