import { geminiService } from "./gemini.service.js";
import { buildFertilizerAdvisoryPrompt } from "../prompts/index.js";

export const fertilizerService = {
  createFertilizerAdvisory: async (supabase, userId, inputData) => {
    const prompt = buildFertilizerAdvisoryPrompt(inputData);
    const advisory = await geminiService.generateFertilizerAdvisory(prompt);

    const { data, error } = await supabase
      .from("fertilizer_advisories")
      .insert({
        user_id: userId,
        farm_id: inputData.farmId || null,
        crop_name: inputData.cropName,
        input_data: inputData,
        advisory: advisory,
      })
      .select()
      .single();

    if (error) {
      console.error("Database insert error [fertilizer_advisories]:", error);
      throw new Error(`Failed to save fertilizer advisory: ${error.message}`);
    }

    return data;
  },

  getFertilizerAdvisories: async (supabase, userId, { limit = 20, offset = 0 } = {}) => {
    const { data, error, count } = await supabase
      .from("fertilizer_advisories")
      .select("*, farms(farm_name, location)", { count: "exact" })
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Failed to fetch fertilizer advisories: ${error.message}`);
    }

    return { advisories: data, total: count };
  },

  getFertilizerAdvisoryById: async (supabase, userId, id) => {
    const { data, error } = await supabase
      .from("fertilizer_advisories")
      .select("*, farms(farm_name, location)")
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        const err = new Error("Fertilizer advisory report not found");
        err.statusCode = 404;
        throw err;
      }
      throw new Error(`Failed to fetch fertilizer advisory: ${error.message}`);
    }

    return data;
  },

  deleteFertilizerAdvisory: async (supabase, userId, id) => {
    const { error } = await supabase
      .from("fertilizer_advisories")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      throw new Error(`Failed to delete fertilizer advisory: ${error.message}`);
    }

    return true;
  },
};

