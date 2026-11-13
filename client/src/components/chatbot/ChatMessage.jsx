import React from "react";
import { Bot, User } from "lucide-react";
import { format, parseISO } from "date-fns";

export const ChatMessage = ({ message }) => {
  const isAssistant = message.role === "assistant";

  let formattedTime = "";
  try {
    if (message.created_at) {
      formattedTime = format(parseISO(message.created_at), "h:mm a");
    }
  } catch (e) {
    // fallback
  }

  return (
    <div className={`flex items-start gap-3 my-3 ${isAssistant ? "" : "flex-row-reverse"}`}>
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
          isAssistant
            ? "bg-forest-600 text-white"
            : "bg-slate-800 text-white"
        }`}
      >
        {isAssistant ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
      </div>

      {/* Message Bubble */}
      <div
        className={`max-w-[85%] sm:max-w-xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-xs ${
          isAssistant
            ? "bg-white text-slate-800 border border-slate-200 rounded-tl-xs"
            : "bg-forest-600 text-white rounded-tr-xs"
        }`}
      >
        <div className="whitespace-pre-wrap space-y-1">
          {message.content}
        </div>

        {formattedTime && (
          <div className={`text-[10px] mt-2 text-right ${isAssistant ? "text-slate-400" : "text-forest-200"}`}>
            {formattedTime}
          </div>
        )}
      </div>
    </div>
  );
};

