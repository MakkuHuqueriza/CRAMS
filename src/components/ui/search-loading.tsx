"use client";

import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useState, useEffect } from "react";

interface SearchLoadingStateProps {
  isLoading: boolean;
}

export const SearchLoadingState = ({ isLoading }: SearchLoadingStateProps) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Initializing search...");

  useEffect(() => {
    if (!isLoading) {
      setProgress(0);
      return;
    }

    const messages = [
      "Initializing search...",
      "Scanning available rooms...",
      "Checking time slots...",
      "Filtering results...",
      "Almost ready...",
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < messages.length) {
        setLoadingText(messages[currentStep]);
        setProgress((currentStep / messages.length) * 100);
      }
    }, 400);

    return () => clearInterval(interval);
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-10 shadow-2xl flex flex-col items-center gap-8 max-w-md mx-4 min-w-[400px]">
        <div className="relative">
          <LoadingSpinner type="fade" size="lg" />
          <div className="absolute -inset-4 border-2 border-[#274c77]/20 rounded-full animate-ping"></div>
        </div>

        <div className="text-center space-y-4">
          <h3 className="text-2xl font-bold text-[#274c77]">Searching Rooms</h3>
          <p className="text-base text-gray-600 animate-pulse min-h-[24px]">
            {loadingText}
          </p>
        </div>

        <div className="w-full space-y-3">
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#274c77] to-[#182657] h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 text-center font-medium">
            {Math.round(progress)}% complete
          </p>
        </div>
      </div>
    </div>
  );
};
