import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { ChatWindow } from "../components/chatbot/ChatWindow";
import { Button } from "../components/common/Button";
import { LoadingScreen } from "../components/common/LoadingScreen";
import { ConfirmationDialog } from "../components/common/ConfirmationDialog";
import {
  Bot,
  Plus,
  MessageSquare,
  Trash2,
  Sparkles,
  ShieldAlert,
} from "lucide-react";

export const AssistantPage = () => {
  const { language, setLanguage } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const res = await api.getConversations();
      const list = res.data || [];
      setConversations(list);

      if (list.length > 0) {
        // Select first conversation
        await selectConversation(list[0].id);
      } else {
        // Automatically start initial conversation
        await handleNewConversation();
      }
    } catch (err) {
      console.error("Error loading chat conversations:", err);
    } finally {
      setLoading(false);
    }
  };

  const selectConversation = async (conversationId) => {
    try {
      const res = await api.getConversationById(conversationId);
      setActiveConversation(res.data.conversation);
      setMessages(res.data.messages || []);
    } catch (err) {
      console.error("Error selecting conversation:", err);
    }
  };

  const handleNewConversation = async () => {
    try {
      const res = await api.createConversation({
        title: "New Agricultural Consultation",
        language: language || "en",
      });
      const newConv = res.data;
      setConversations([newConv, ...conversations]);
      setActiveConversation(newConv);
      setMessages([]);
    } catch (err) {
      console.error("Error creating new conversation:", err);
    }
  };

  const handleSendMessage = async (text) => {
    if (!activeConversation) return;

    // Optimistically show user message
    const tempUserMsg = {
      id: `temp-${Date.now()}`,
      role: "user",
      content: text,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      setSending(true);
      const res = await api.sendChatMessage(activeConversation.id, {
        message: text,
        language: language || "en",
      });

      // Update messages with actual server and assistant responses
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== tempUserMsg.id),
        res.data.userMessage,
        res.data.assistantMessage,
      ]);

      // Refresh conversations list to update title and updated_at
      const convListRes = await api.getConversations();
      setConversations(convListRes.data || []);
    } catch (err) {
      console.error("Error sending message:", err);
      // Append error notice in chat
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          content: `⚠️ Failed to receive response: ${err.message || "Please check your network and Gemini API key."}`,
          created_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  const handleDeleteConversation = async () => {
    if (!deleteTarget) return;
    try {
      await api.deleteConversation(deleteTarget.id);
      const remaining = conversations.filter((c) => c.id !== deleteTarget.id);
      setConversations(remaining);
      if (activeConversation?.id === deleteTarget.id) {
        if (remaining.length > 0) {
          selectConversation(remaining[0].id);
        } else {
          setActiveConversation(null);
          setMessages([]);
        }
      }
      setDeleteTarget(null);
    } catch (err) {
      console.error("Error deleting conversation:", err);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  if (loading) {
    return <LoadingScreen message="Connecting to AgroAI Assistant..." />;
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-forest-100 text-forest-800">
              Conversational AgroAI
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Agricultural AI Assistant
          </h2>
          <p className="text-xs text-slate-500">
            Ask any farming question in your preferred language: Kannada, Hindi, Telugu, Urdu, Tamil, Malayalam, or English.
          </p>
        </div>

        <Button variant="primary" size="md" icon={Plus} onClick={handleNewConversation}>
          New Conversation
        </Button>
      </div>

      {/* Main Chat Layout: Sidebar for sessions + Chat Window */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Conversations Thread List */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs font-bold text-slate-700">
            <span>Consultation Threads</span>
            <span className="text-[11px] text-slate-400">{conversations.length}</span>
          </div>

          <div className="space-y-1.5 max-h-[500px] overflow-y-auto">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => selectConversation(conv.id)}
                className={`p-2.5 rounded-xl text-xs flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                  activeConversation?.id === conv.id
                    ? "bg-forest-50 text-forest-900 font-bold border border-forest-200"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <MessageSquare className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                  <span className="truncate">{conv.title}</span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteTarget(conv);
                  }}
                  className="p-1 text-slate-400 hover:text-rose-600 rounded-md transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="lg:col-span-3">
          <ChatWindow
            messages={messages}
            loading={sending}
            onSendMessage={handleSendMessage}
            currentLanguage={language}
            onLanguageChange={setLanguage}
            conversationTitle={activeConversation?.title || "AgroAI Consultation"}
          />
        </div>
      </div>

      <ConfirmationDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConversation}
        title="Delete Consultation Thread?"
        message="Are you sure you want to delete this chat conversation? All message history will be removed."
      />
    </div>
  );
};

