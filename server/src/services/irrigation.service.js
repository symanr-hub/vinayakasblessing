import { geminiService } from "./gemini.service.js";
import { buildIrrigationAdvisoryPrompt } from "../prompts/index.js";

export const irrigationService = {
  createIrrigationAdvisory: async (supabase, userId, inputData) => {
    const prompt = buildIrrigationAdvisoryPrompt(inputData);
    const advisory = await geminiService.generateIrrigationAdvisory(prompt);

    const { data, error } = await supabase
      .from("irrigation_advisories")
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
      console.error("Database insert error [irrigation_advisories]:", error);
      throw new Error(`Failed to save irrigation advisory: ${error.message}`);
    }

    return data;
  },

  getIrrigationAdvisories: async (supabase, userId, { limit = 20, offset = 0 } = {}) => {
    const { data, error, count } = await supabase
      .from("irrigation_advisories")
      .select("*, farms(farm_name, location)", { count: "exact" })
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Failed to fetch irrigation advisories: ${error.message}`);
    }

    return { advisories: data, total: count };
  },

  getIrrigationAdvisoryById: async (supabase, userId, id) => {
    const { data, error } = await supabase
      .from("irrigation_advisories")
      .select("*, farms(farm_name, location)")
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        const err = new Error("Irrigation advisory not found");
        err.statusCode = 404;
        throw err;
      }
      throw new Error(`Failed to fetch irrigation advisory: ${error.message}`);
    }

    return data;
  },

  deleteIrrigationAdvisory: async (supabase, userId, id) => {
    const { error } = await supabase
      .from("irrigation_advisories")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      throw new Error(`Failed to delete irrigation advisory: ${error.message}`);
    }

    return true;
  },
};

