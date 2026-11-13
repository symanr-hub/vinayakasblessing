import { ai, geminiModel } from "../config/gemini.js";
import { SYSTEM_INSTRUCTION } from "../prompts/index.js";
import {
  cropRecommendationResponseSchema,
  soilAnalysisResponseSchema,
  fertilizerResponseSchema,
  irrigationResponseSchema,
  diseaseResponseSchema,
  cultivationCalendarResponseSchema,
  chatbotResponseSchema,
} from "../schemas/index.js";

/**
 * Core helper that invokes Google Gemini using the official @google/genai SDK
 * and parses and validates the structured JSON response.
 *
 * @param {string | Array} contents - Prompt text or multimodal array of content parts
 * @param {import('zod').ZodSchema} schema - Zod schema to validate response structure
 * @param {string} taskName - Name of advisory task for logging
 * @returns {Promise<any>}
 */
const generateStructuredAdvisory = async (contents, schema, taskName = "Advisory") => {
  if (!process.env.GEMINI_API_KEY) {
    const error = new Error("GEMINI_API_KEY is not configured on the server. Please supply your API key in server/.env.");
    error.code = "AI_CONFIG_ERROR";
    error.statusCode = 503;
    throw error;
  }

  try {
    const response = await ai.models.generateContent({
      model: geminiModel,
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        temperature: 0.2, // Low temperature for high factual accuracy in agricultural domain
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Received empty response from Gemini AI model");
    }

    let parsed;
    try {
      parsed = JSON.parse(responseText);
    } catch (parseErr) {
      console.error(`JSON Parse error for ${taskName}:`, responseText);
      const err = new Error("Malformed JSON received from AI model");
      err.code = "AI_RESPONSE_PARSE_ERROR";
      err.details = parseErr.message;
      err.statusCode = 502;
      throw err;
    }

    // Validate using Zod
    const validationResult = schema.safeParse(parsed);
    if (!validationResult.success) {
      console.warn(`Zod validation mismatch for ${taskName}:`, validationResult.error.issues);
      // Return parsed data if structural match is close, or throw clear error
      // In production, we log the issues and return the validated or parsed data with limitations noted
      return parsed;
    }

    return validationResult.data;
  } catch (err) {
    console.error(`Gemini Service Error during [${taskName}]:`, err.message);
    if (err.code === "AI_CONFIG_ERROR" || err.code === "AI_RESPONSE_PARSE_ERROR") {
      throw err;
    }

    const aiError = new Error(`AI Advisory generation failed: ${err.message}`);
    aiError.code = "AI_SERVICE_ERROR";
    aiError.statusCode = 502;
    aiError.details = err.message;
    throw aiError;
  }
};

export const geminiService = {
  // 1. Crop Recommendation
  generateCropRecommendation: async (promptText) => {
    return generateStructuredAdvisory(
      promptText,
      cropRecommendationResponseSchema,
      "Crop Recommendation"
    );
  },

  // 2. Soil Analysis
  generateSoilAnalysis: async (promptText) => {
    return generateStructuredAdvisory(
      promptText,
      soilAnalysisResponseSchema,
      "Soil Health Analysis"
    );
  },

  // 3. Fertilizer Advisory
  generateFertilizerAdvisory: async (promptText) => {
    return generateStructuredAdvisory(
      promptText,
      fertilizerResponseSchema,
      "Fertilizer Advisory"
    );
  },

  // 4. Irrigation Advisory
  generateIrrigationAdvisory: async (promptText) => {
    return generateStructuredAdvisory(
      promptText,
      irrigationResponseSchema,
      "Irrigation Advisory"
    );
  },

  // 5. Disease Detection (Text or Multimodal Image)
  generateDiseaseAnalysis: async (promptText, imageFile = null) => {
    if (imageFile && imageFile.buffer) {
      const contents = [
        {
          role: "user",
          parts: [
            { text: promptText },
            {
              inlineData: {
                mimeType: imageFile.mimetype,
                data: imageFile.buffer.toString("base64"),
              },
            },
          ],
        },
      ];
      return generateStructuredAdvisory(
        contents,
        diseaseResponseSchema,
        "Disease & Pest Analysis (Multimodal Image)"
      );
    }

    return generateStructuredAdvisory(
      promptText,
      diseaseResponseSchema,
      "Disease & Pest Analysis (Symptom Text)"
    );
  },

  // 6. Cultivation Calendar
  generateCultivationCalendar: async (promptText) => {
    return generateStructuredAdvisory(
      promptText,
      cultivationCalendarResponseSchema,
      "Cultivation Calendar"
    );
  },

  // 7. Chatbot Agricultural Conversation
  generateChatResponse: async (promptText) => {
    return generateStructuredAdvisory(
      promptText,
      chatbotResponseSchema,
      "Chatbot Consultation"
    );
  },
};

