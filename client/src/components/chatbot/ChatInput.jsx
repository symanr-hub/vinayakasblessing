import React, { useState, useRef, useEffect } from "react";
import { Send, Globe } from "lucide-react";
import { SUPPORTED_LANGUAGES } from "../../utils/translations";

export const ChatInput = ({ onSend, loading = false, currentLanguage = "en", onLanguageChange }) => {
  const [text, setText] = useState("");
  const textareaRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (!text.trim() || loading) return;
    onSend(text.trim());
    setText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleChange = (e) => {
    setText(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  return (
    <div className="border-t border-slate-200 bg-white p-3 rounded-b-2xl">
      <div className="flex items-center justify-between text-xs text-slate-500 mb-2 px-1">
        <span className="text-[11px]">Type in your preferred language:</span>
        <div className="flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-forest-600" />
          <select
            value={currentLanguage}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="text-[11px] font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-md px-1.5 py-0.5"
          >
            {SUPPORTED_LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.nativeName} ({l.name})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-end gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200 focus-within:border-forest-500 focus-within:bg-white transition-colors">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question about crop selection, fertilizer, pests, or irrigation..."
          rows={1}
          disabled={loading}
          className="flex-1 bg-transparent text-slate-900 text-xs sm:text-sm placeholder:text-slate-400 resize-none outline-none max-h-32 p-1"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={!text.trim() || loading}
          className="w-8 h-8 rounded-lg bg-forest-600 hover:bg-forest-700 disabled:opacity-40 text-white flex items-center justify-center shrink-0 transition-colors shadow-xs"
          title="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

