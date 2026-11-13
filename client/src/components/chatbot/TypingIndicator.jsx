import React from "react";
import { Bot } from "lucide-react";

export const TypingIndicator = () => {
  return (
    <div className="flex items-start gap-3 my-2 animate-in fade-in duration-200">
      <div className="w-8 h-8 rounded-xl bg-forest-600 text-white flex items-center justify-center shrink-0 shadow-xs">
        <Bot className="w-4 h-4" />
      </div>
      <div className="bg-white rounded-2xl rounded-tl-xs px-4 py-3 border border-slate-200 shadow-xs flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-forest-500 animate-bounce" style={{ animationDelay: "0ms" }} />
        <span className="w-2 h-2 rounded-full bg-forest-500 animate-bounce" style={{ animationDelay: "150ms" }} />
        <span className="w-2 h-2 rounded-full bg-forest-500 animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  );
};

