"use client";

import type React from "react";
import {
  FadeLoader,
  ClipLoader,
  PulseLoader,
  BeatLoader,
} from "react-spinners";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  type?: "fade" | "clip" | "pulse" | "beat";
  size?: "sm" | "md" | "lg";
  color?: string;
  className?: string;
}

export const LoadingSpinner = ({
  type = "fade",
  size = "md",
  color = "#274c77",
  className,
}: LoadingSpinnerProps) => {
  const getSizeProps = () => {
    switch (size) {
      case "sm":
        return type === "fade"
          ? { height: 8, width: 2, radius: 1 }
          : { size: 20 };
      case "md":
        return type === "fade"
          ? { height: 12, width: 3, radius: 2 }
          : { size: 30 };
      case "lg":
        return type === "fade"
          ? { height: 16, width: 4, radius: 2 }
          : { size: 40 };
      default:
        return type === "fade"
          ? { height: 12, width: 3, radius: 2 }
          : { size: 30 };
    }
  };

  const sizeProps = getSizeProps();

  const renderSpinner = () => {
    switch (type) {
      case "fade":
        return <FadeLoader color={color} {...sizeProps} />;
      case "clip":
        return <ClipLoader color={color} size={sizeProps.size} />;
      case "pulse":
        return <PulseLoader color={color} size={sizeProps.size} />;
      case "beat":
        return <BeatLoader color={color} size={sizeProps.size} />;
      default:
        return <FadeLoader color={color} {...sizeProps} />;
    }
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      {renderSpinner()}
    </div>
  );
};

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  children: React.ReactNode;
  spinnerType?: "fade" | "clip" | "pulse" | "beat";
}

export const LoadingOverlay = ({
  isLoading,
  message,
  children,
  spinnerType = "fade",
}: LoadingOverlayProps) => {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg">
          <div className="flex flex-col items-center gap-4">
            <LoadingSpinner type={spinnerType} size="lg" />
            {message && (
              <p className="text-sm font-medium text-[#274c77] animate-pulse text-center max-w-xs">
                {message}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
