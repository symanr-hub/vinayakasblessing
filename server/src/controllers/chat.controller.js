import { chatService } from "../services/chat.service.js";

export const createConversation = async (req, res, next) => {
  try {
    const conversation = await chatService.createConversation(
      req.supabase,
      req.user.id,
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Chat conversation started",
      data: conversation,
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

export const getConversations = async (req, res, next) => {
  try {
    const conversations = await chatService.getConversations(
      req.supabase,
      req.user.id
    );

    res.json({
      success: true,
      message: "Conversations retrieved successfully",
      data: conversations,
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

export const getConversationById = async (req, res, next) => {
  try {
    const conversation = await chatService.getConversationById(
      req.supabase,
      req.user.id,
      req.params.id
    );

    res.json({
      success: true,
      message: "Conversation retrieved",
      data: conversation,
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

export const sendMessage = async (req, res, next) => {
  try {
    const result = await chatService.sendMessage(
      req.supabase,
      req.user.id,
      req.params.id,
      req.body.message,
      req.body.language
    );

    res.json({
      success: true,
      message: "Message processed successfully",
      data: result,
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteConversation = async (req, res, next) => {
  try {
    await chatService.deleteConversation(
      req.supabase,
      req.user.id,
      req.params.id
    );

    res.json({
      success: true,
      message: "Conversation deleted successfully",
      data: null,
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

