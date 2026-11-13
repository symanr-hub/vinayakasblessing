import { geminiService } from "./gemini.service.js";
import { buildChatbotPrompt } from "../prompts/index.js";

export const chatService = {
  createConversation: async (supabase, userId, { title = "New Agricultural Consultation", language = "en" }) => {
    const { data, error } = await supabase
      .from("chat_conversations")
      .insert({
        user_id: userId,
        title: title,
        language: language,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create conversation: ${error.message}`);
    }

    return data;
  },

  getConversations: async (supabase, userId) => {
    const { data, error } = await supabase
      .from("chat_conversations")
      .select("*, chat_messages(count)")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch conversations: ${error.message}`);
    }

    return data;
  },

  getConversationById: async (supabase, userId, conversationId) => {
    const { data: conversation, error: convErr } = await supabase
      .from("chat_conversations")
      .select("*")
      .eq("id", conversationId)
      .eq("user_id", userId)
      .single();

    if (convErr || !conversation) {
      const err = new Error("Conversation not found");
      err.statusCode = 404;
      throw err;
    }

    const { data: messages, error: msgErr } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (msgErr) {
      throw new Error(`Failed to fetch messages: ${msgErr.message}`);
    }

    return {
      conversation,
      messages: messages || [],
    };
  },

  sendMessage: async (supabase, userId, conversationId, messageContent, language = "en") => {
    // 1. Verify conversation ownership and get details
    const { data: conversation, error: convErr } = await supabase
      .from("chat_conversations")
      .select("*")
      .eq("id", conversationId)
      .eq("user_id", userId)
      .single();

    if (convErr || !conversation) {
      const err = new Error("Conversation not found");
      err.statusCode = 404;
      throw err;
    }

    // 2. Insert User message
    const { data: userMsg, error: userMsgErr } = await supabase
      .from("chat_messages")
      .insert({
        conversation_id: conversationId,
        user_id: userId,
        role: "user",
        content: messageContent,
      })
      .select()
      .single();

    if (userMsgErr) {
      throw new Error(`Failed to save message: ${userMsgErr.message}`);
    }

    // 3. Retrieve recent history for context
    const { data: history } = await supabase
      .from("chat_messages")
      .select("role, content")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })
      .limit(10);

    // 4. Generate AI response using Gemini
    const chatLang = language || conversation.language || "en";
    const prompt = buildChatbotPrompt(messageContent, history || [], chatLang);
    const aiResult = await geminiService.generateChatResponse(prompt);

    // Format assistant text (incorporating warnings and related topics if present)
    let formattedResponse = aiResult.answer;
    if (aiResult.warnings && aiResult.warnings.length > 0) {
      formattedResponse += `\n\n⚠️ **Agricultural Note / Safety Advisory:**\n- ` + aiResult.warnings.join("\n- ");
    }
    if (aiResult.relatedTopics && aiResult.relatedTopics.length > 0) {
      formattedResponse += `\n\n🌱 **Suggested Follow-up Topics:**\n- ` + aiResult.relatedTopics.join("\n- ");
    }

    // 5. Insert Assistant message
    const { data: assistantMsg, error: assistantMsgErr } = await supabase
      .from("chat_messages")
      .insert({
        conversation_id: conversationId,
        user_id: userId,
        role: "assistant",
        content: formattedResponse,
      })
      .select()
      .single();

    if (assistantMsgErr) {
      throw new Error(`Failed to save assistant response: ${assistantMsgErr.message}`);
    }

    // 6. Update conversation title if default and updated_at
    const isFirstQuery = !history || history.length <= 2;
    const updateData = { updated_at: new Date().toISOString() };
    if (isFirstQuery && conversation.title === "New Conversation") {
      updateData.title = messageContent.slice(0, 40) + (messageContent.length > 40 ? "..." : "");
    }

    await supabase
      .from("chat_conversations")
      .update(updateData)
      .eq("id", conversationId);

    return {
      userMessage: userMsg,
      assistantMessage: assistantMsg,
      structuredData: aiResult,
    };
  },

  deleteConversation: async (supabase, userId, conversationId) => {
    const { error } = await supabase
      .from("chat_conversations")
      .delete()
      .eq("id", conversationId)
      .eq("user_id", userId);

    if (error) {
      throw new Error(`Failed to delete conversation: ${error.message}`);
    }

    return true;
  },
};

