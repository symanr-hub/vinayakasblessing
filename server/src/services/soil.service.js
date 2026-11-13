import { geminiService } from "./gemini.service.js";
import { buildSoilAnalysisPrompt } from "../prompts/index.js";

export const soilService = {
  createSoilReport: async (supabase, userId, inputData) => {
    const prompt = buildSoilAnalysisPrompt(inputData);
    const analysis = await geminiService.generateSoilAnalysis(prompt);

    const { data, error } = await supabase
      .from("soil_reports")
      .insert({
        user_id: userId,
        farm_id: inputData.farmId || null,
        soil_data: inputData,
        analysis: analysis,
      })
      .select()
      .single();

    if (error) {
      console.error("Database insert error [soil_reports]:", error);
      throw new Error(`Failed to save soil report: ${error.message}`);
    }

    return data;
  },

  getSoilReports: async (supabase, userId, { limit = 20, offset = 0 } = {}) => {
    const { data, error, count } = await supabase
      .from("soil_reports")
      .select("*, farms(farm_name, location)", { count: "exact" })
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Failed to fetch soil reports: ${error.message}`);
    }

    return { reports: data, total: count };
  },

  getSoilReportById: async (supabase, userId, id) => {
    const { data, error } = await supabase
      .from("soil_reports")
      .select("*, farms(farm_name, location)")
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        const err = new Error("Soil report not found");
        err.statusCode = 404;
        throw err;
      }
      throw new Error(`Failed to fetch soil report: ${error.message}`);
    }

    return data;
  },

  deleteSoilReport: async (supabase, userId, id) => {
    const { error } = await supabase
      .from("soil_reports")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      throw new Error(`Failed to delete soil report: ${error.message}`);
    }

    return true;
  },
};

