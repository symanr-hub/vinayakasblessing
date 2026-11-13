import React, { useRef, useEffect } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { TypingIndicator } from "./TypingIndicator";
import { Bot, Sparkles } from "lucide-react";

export const ChatWindow = ({
  messages = [],
  loading = false,
  onSendMessage,
  currentLanguage = "en",
  onLanguageChange,
  conversationTitle = "AgroAI Advisory Session",
}) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const starterQuestions = [
    "Which crops grow best in black soil during Kharif in Karnataka?",
    "How to manage yellow vein mosaic virus in bhindi (okra)?",
    "What is the best irrigation interval for sugarcane?",
    "How do I prepare vermicompost for organic vegetable farming?",
  ];

  return (
    <div className="flex flex-col h-[650px] bg-slate-50/50 rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Chat Top Banner */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-white border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-forest-600 text-white flex items-center justify-center shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 truncate max-w-xs sm:max-w-md">
              {conversationTitle}
            </h3>
            <p className="text-[11px] text-slate-400">
              Multilingual precision agriculture assistant powered by Gemini
            </p>
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-2">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-forest-50 text-forest-600 flex items-center justify-center">
              <Sparkles className="w-7 h-7" />
            </div>
            <div className="max-w-sm space-y-1">
              <h4 className="text-sm font-bold text-slate-800">
                Ask AgroAI Anything About Farming
              </h4>
              <p className="text-xs text-slate-500">
                Get quick, responsible recommendations for crops, nutrients, pests, water management, and sustainable practices.
              </p>
            </div>

            {/* Quick Starter Chips */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-md w-full pt-2">
              {starterQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => onSendMessage(q)}
                  className="text-left p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-forest-50 hover:border-forest-300 text-xs text-slate-700 transition-colors"
                >
                  "{q}"
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <ChatMessage key={msg.id || msg.created_at} message={msg} />
            ))}
            {loading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Chat Input Field */}
      <ChatInput
        onSend={onSendMessage}
        loading={loading}
        currentLanguage={currentLanguage}
        onLanguageChange={onLanguageChange}
      />
    </div>
  );
};

