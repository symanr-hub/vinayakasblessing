import crypto from "crypto";
import { geminiService } from "./gemini.service.js";
import { buildDiseaseDetectionPrompt } from "../prompts/index.js";
import { verifyFileSignature } from "../middleware/upload.js";
import { supabaseAdmin } from "../config/supabase.js";

export const diseaseService = {
  createDiseaseReport: async (supabase, userId, inputData, file = null) => {
    let imagePath = null;
    let signedImageUrl = null;

    // Handle file upload if present
    if (file) {
      const ext = verifyFileSignature(file.buffer);
      if (!ext) {
        const error = new Error("Invalid or spoofed file signature. Only authentic JPEG, PNG, or WebP images are allowed.");
        error.statusCode = 400;
        throw error;
      }

      const fileName = `${userId}/${Date.now()}-${crypto.randomUUID()}.${ext}`;

      // Upload to private Supabase bucket 'crop-images'
      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from("crop-images")
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        });

      if (uploadError) {
        console.error("Storage upload error:", uploadError);
        // We log but continue or throw: since user wanted image analysis, throw clear error
        throw new Error(`Failed to upload crop image: ${uploadError.message}`);
      }

      imagePath = uploadData.path;

      // Generate signed URL valid for 7 days
      const { data: signedData } = await supabaseAdmin.storage
        .from("crop-images")
        .createSignedUrl(imagePath, 60 * 60 * 24 * 7);

      if (signedData) {
        signedImageUrl = signedData.signedUrl;
      }
    }

    // Build prompt and execute Gemini analysis (multimodal if image file exists)
    const prompt = buildDiseaseDetectionPrompt(inputData, Boolean(file));
    const analysis = await geminiService.generateDiseaseAnalysis(prompt, file);

    // Save to database
    const { data, error } = await supabase
      .from("disease_reports")
      .insert({
        user_id: userId,
        farm_id: inputData.farmId || null,
        crop_name: inputData.cropName,
        symptoms: inputData.symptoms,
        image_path: imagePath,
        analysis: analysis,
      })
      .select()
      .single();

    if (error) {
      console.error("Database insert error [disease_reports]:", error);
      throw new Error(`Failed to save disease report: ${error.message}`);
    }

    // Attach signedImageUrl in response
    return {
      ...data,
      signed_image_url: signedImageUrl,
    };
  },

  getDiseaseReports: async (supabase, userId, { limit = 20, offset = 0 } = {}) => {
    const { data, error, count } = await supabase
      .from("disease_reports")
      .select("*, farms(farm_name, location)", { count: "exact" })
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Failed to fetch disease reports: ${error.message}`);
    }

    // Generate signed URLs for reports with images
    const enhancedData = await Promise.all(
      (data || []).map(async (report) => {
        if (report.image_path) {
          const { data: signed } = await supabaseAdmin.storage
            .from("crop-images")
            .createSignedUrl(report.image_path, 60 * 60 * 24);
          return { ...report, signed_image_url: signed?.signedUrl || null };
        }
        return report;
      })
    );

    return { reports: enhancedData, total: count };
  },

  getDiseaseReportById: async (supabase, userId, id) => {
    const { data, error } = await supabase
      .from("disease_reports")
      .select("*, farms(farm_name, location)")
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        const err = new Error("Disease report not found");
        err.statusCode = 404;
        throw err;
      }
      throw new Error(`Failed to fetch disease report: ${error.message}`);
    }

    let signedImageUrl = null;
    if (data.image_path) {
      const { data: signed } = await supabaseAdmin.storage
        .from("crop-images")
        .createSignedUrl(data.image_path, 60 * 60 * 24);
      signedImageUrl = signed?.signedUrl || null;
    }

    return { ...data, signed_image_url: signedImageUrl };
  },

  deleteDiseaseReport: async (supabase, userId, id) => {
    // Get image path first to delete from storage
    const { data: report } = await supabase
      .from("disease_reports")
      .select("image_path")
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (report?.image_path) {
      await supabaseAdmin.storage.from("crop-images").remove([report.image_path]);
    }

    const { error } = await supabase
      .from("disease_reports")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      throw new Error(`Failed to delete disease report: ${error.message}`);
    }

    return true;
  },
};

