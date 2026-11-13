import { geminiService } from "./gemini.service.js";
import { buildCropRecommendationPrompt } from "../prompts/index.js";
import { geminiModel } from "../config/gemini.js";

export const cropService = {
  createRecommendation: async (supabase, userId, inputData) => {
    // 1. Build prompt
    const prompt = buildCropRecommendationPrompt(inputData);

    // 2. Call Gemini
    const recommendations = await geminiService.generateCropRecommendation(prompt);

    // 3. Persist in database using user-scoped Supabase client (RLS enforced)
    const { data, error } = await supabase
      .from("crop_recommendations")
      .insert({
        user_id: userId,
        farm_id: inputData.farmId || null,
        input_data: inputData,
        recommendations: recommendations,
        advisory_language: inputData.language || "en",
        model_name: geminiModel,
      })
      .select()
      .single();

    if (error) {
      console.error("Database insert error [crop_recommendations]:", error);
      throw new Error(`Failed to save crop recommendation: ${error.message}`);
    }

    return data;
  },

  getRecommendations: async (supabase, userId, { limit = 20, offset = 0 } = {}) => {
    const { data, error, count } = await supabase
      .from("crop_recommendations")
      .select("*, farms(farm_name, location)", { count: "exact" })
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Failed to fetch crop recommendations: ${error.message}`);
    }

    return { recommendations: data, total: count };
  },

  getRecommendationById: async (supabase, userId, id) => {
    const { data, error } = await supabase
      .from("crop_recommendations")
      .select("*, farms(farm_name, location)")
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        const notFound = new Error("Crop recommendation report not found");
        notFound.statusCode = 404;
        throw notFound;
      }
      throw new Error(`Failed to fetch report: ${error.message}`);
    }

    return data;
  },

  deleteRecommendation: async (supabase, userId, id) => {
    const { error } = await supabase
      .from("crop_recommendations")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      throw new Error(`Failed to delete crop recommendation: ${error.message}`);
    }

    return true;
  },
};

