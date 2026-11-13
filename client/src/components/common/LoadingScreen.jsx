import React from "react";
import { Sprout } from "lucide-react";

export const LoadingScreen = ({ message = "Analyzing agricultural information..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] w-full p-8 text-center">
      <div className="relative mb-4">
        <div className="w-16 h-16 rounded-2xl bg-forest-100 flex items-center justify-center text-forest-600 animate-pulse">
          <Sprout className="w-8 h-8 animate-bounce" />
        </div>
        <div className="absolute inset-0 rounded-2xl border-2 border-forest-400 animate-ping opacity-25" />
      </div>
      <h4 className="text-base font-semibold text-slate-800 mb-1">{message}</h4>
      <p className="text-xs text-slate-500 max-w-xs">
        Synthesizing soil parameters, seasonal patterns, and regional package of practices.
      </p>
    </div>
  );
};

