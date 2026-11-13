import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || "";
export const geminiModel = process.env.GEMINI_MODEL || "gemini-2.5-flash";

if (!apiKey && process.env.NODE_ENV !== "test") {
  console.warn("⚠️ Warning: GEMINI_API_KEY environment variable is not set. Real AI advisories will fail until provided.");
}

export const ai = new GoogleGenAI({
  apiKey: apiKey,
});

