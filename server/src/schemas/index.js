import { z } from "zod";

// ==============================================================================
// 1. CLIENT REQUEST SCHEMAS
// ==============================================================================

// User Profile Update Schema
export const profileSchema = z.object({
  full_name: z.string().trim().min(2, "Full name must be at least 2 characters").max(100),
  phone: z.string().trim().max(20).optional().nullable(),
  country: z.string().trim().default("India"),
  state: z.string().trim().max(100).optional().nullable(),
  district: z.string().trim().max(100).optional().nullable(),
  village: z.string().trim().max(100).optional().nullable(),
  preferred_language: z.enum(["en", "kn", "hi", "ur", "te", "ta", "ml"]).default("en"),
  farming_experience: z.number().int().nonnegative().default(0),
  land_area: z.number().nonnegative().optional().nullable(),
  land_unit: z.enum(["acre", "hectare", "sqm", "bigha", "guntha"]).default("acre"),
  farming_type: z.enum(["Conventional", "Organic", "Mixed", "Hydroponic", "Natural"]).default("Conventional"),
  irrigation_available: z.boolean().default(false)
});

// Farm Parcel Schema
export const farmSchema = z.object({
  farm_name: z.string().trim().min(1, "Farm name is required").max(100),
  location: z.string().trim().max(200).optional().nullable(),
  state: z.string().trim().max(100).optional().nullable(),
  district: z.string().trim().max(100).optional().nullable(),
  soil_type: z.string().trim().max(100).optional().nullable(),
  soil_ph: z.number().min(0).max(14).optional().nullable(),
  land_area: z.number().positive("Land area must be greater than zero"),
  land_unit: z.enum(["acre", "hectare", "sqm", "bigha", "guntha"]).default("acre"),
  irrigation_method: z.string().trim().max(100).optional().nullable()
});

// Crop Recommendation Request Schema
export const cropRecommendationSchema = z.object({
  farmId: z.string().uuid().optional().nullable(),
  state: z.string().trim().min(1, "State is required").max(100),
  district: z.string().trim().min(1, "District is required").max(100),
  soilType: z.string().trim().min(1, "Soil type is required"),
  season: z.enum(["Kharif", "Rabi", "Zaid", "Year-round", "Other"]),
  landArea: z.number().positive("Land area must be positive"),
  landUnit: z.enum(["acre", "hectare", "sqm", "bigha", "guntha"]).default("acre"),
  soilPH: z.number().min(0).max(14).nullable().optional(),
  nitrogen: z.number().nonnegative().nullable().optional(),
  phosphorus: z.number().nonnegative().nullable().optional(),
  potassium: z.number().nonnegative().nullable().optional(),
  organicCarbon: z.number().nonnegative().nullable().optional(),
  temperature: z.number().nullable().optional(),
  humidity: z.number().min(0).max(100).nullable().optional(),
  rainfall: z.number().nonnegative().nullable().optional(),
  irrigationAvailable: z.boolean().default(false),
  preferredCategory: z.string().trim().max(100).optional().nullable(),
  previousCrop: z.string().trim().max(100).optional().nullable(),
  language: z.enum(["en", "kn", "hi", "ur", "te", "ta", "ml"]).default("en")
});

// Soil Analysis Request Schema
export const soilAnalysisSchema = z.object({
  farmId: z.string().uuid().optional().nullable(),
  soilType: z.string().trim().min(1, "Soil type is required"),
  soilPH: z.number().min(0).max(14).nullable().optional(),
  nitrogen: z.number().nonnegative().nullable().optional(),
  phosphorus: z.number().nonnegative().nullable().optional(),
  potassium: z.number().nonnegative().nullable().optional(),
  organicCarbon: z.number().nonnegative().nullable().optional(),
  electricalConductivity: z.number().nonnegative().nullable().optional(),
  soilTexture: z.string().trim().max(100).optional().nullable(),
  micronutrients: z.string().trim().max(300).optional().nullable(),
  laboratoryObservations: z.string().trim().max(1000).optional().nullable(),
  targetCrops: z.string().trim().max(200).optional().nullable(),
  language: z.enum(["en", "kn", "hi", "ur", "te", "ta", "ml"]).default("en")
});

// Fertilizer Advisory Request Schema
export const fertilizerAdvisorySchema = z.object({
  farmId: z.string().uuid().optional().nullable(),
  cropName: z.string().trim().min(1, "Crop name is required").max(100),
  cropVariety: z.string().trim().max(100).optional().nullable(),
  growthStage: z.string().trim().min(1, "Growth stage is required"),
  landArea: z.number().positive("Land area must be positive"),
  landUnit: z.enum(["acre", "hectare", "sqm", "bigha", "guntha"]).default("acre"),
  soilPH: z.number().min(0).max(14).nullable().optional(),
  nitrogen: z.number().nonnegative().nullable().optional(),
  phosphorus: z.number().nonnegative().nullable().optional(),
  potassium: z.number().nonnegative().nullable().optional(),
  organicCarbon: z.number().nonnegative().nullable().optional(),
  existingFertilizer: z.string().trim().max(300).optional().nullable(),
  farmingMethod: z.enum(["Conventional", "Organic", "Integrated", "Natural"]).default("Conventional"),
  language: z.enum(["en", "kn", "hi", "ur", "te", "ta", "ml"]).default("en")
});

// Irrigation Advisory Request Schema
export const irrigationAdvisorySchema = z.object({
  farmId: z.string().uuid().optional().nullable(),
  cropName: z.string().trim().min(1, "Crop name is required").max(100),
  growthStage: z.string().trim().min(1, "Growth stage is required"),
  soilType: z.string().trim().min(1, "Soil type is required"),
  landArea: z.number().positive("Land area must be positive"),
  landUnit: z.enum(["acre", "hectare", "sqm", "bigha", "guntha"]).default("acre"),
  irrigationMethod: z.string().trim().min(1, "Irrigation method is required"),
  waterAvailability: z.enum(["Abundant", "Moderate", "Scarce", "Rain-fed Only"]),
  lastRainfall: z.string().trim().max(100).optional().nullable(),
  temperature: z.number().nullable().optional(),
  humidity: z.number().min(0).max(100).nullable().optional(),
  language: z.enum(["en", "kn", "hi", "ur", "te", "ta", "ml"]).default("en")
});

// Disease Detection Request Schema
export const diseaseDetectionSchema = z.object({
  farmId: z.string().uuid().optional().nullable(),
  cropName: z.string().trim().min(1, "Crop name is required").max(100),
  affectedPlantPart: z.enum(["Leaves", "Stem", "Roots", "Flowers", "Fruit/Grain", "Whole Plant", "Other"]),
  symptoms: z.string().trim().min(5, "Please describe the symptoms in more detail").max(1500),
  duration: z.string().trim().min(1, "Duration is required"),
  visibleDamage: z.string().trim().max(500).optional().nullable(),
  weatherCondition: z.string().trim().max(200).optional().nullable(),
  language: z.enum(["en", "kn", "hi", "ur", "te", "ta", "ml"]).default("en")
});

// Cultivation Calendar Request Schema
export const cultivationCalendarSchema = z.object({
  farmId: z.string().uuid().optional().nullable(),
  cropName: z.string().trim().min(1, "Crop name is required").max(100),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Start date must be YYYY-MM-DD format"),
  state: z.string().trim().max(100).optional().nullable(),
  district: z.string().trim().max(100).optional().nullable(),
  soilType: z.string().trim().max(100).optional().nullable(),
  irrigationAvailable: z.boolean().default(false),
  farmingType: z.string().trim().default("Conventional"),
  language: z.enum(["en", "kn", "hi", "ur", "te", "ta", "ml"]).default("en")
});

// Chat Conversation & Message Schemas
export const createConversationSchema = z.object({
  title: z.string().trim().min(1).max(150).default("New Agricultural Consultation"),
  language: z.enum(["en", "kn", "hi", "ur", "te", "ta", "ml"]).default("en")
});

export const chatMessageSchema = z.object({
  message: z.string().trim().min(1, "Message cannot be empty").max(2000),
  language: z.enum(["en", "kn", "hi", "ur", "te", "ta", "ml"]).default("en")
});

// Update Calendar Activities (Mark completed)
export const updateCalendarActivitiesSchema = z.object({
  activities: z.array(z.object({
    id: z.string().optional(),
    stage: z.string(),
    dayFromStart: z.number().int().nonnegative(),
    dayToStart: z.number().int().nonnegative(),
    description: z.string(),
    importance: z.enum(["low", "medium", "high", "critical"]).default("medium"),
    completed: z.boolean().default(false),
    notes: z.string().optional()
  }))
});


// ==============================================================================
// 2. AI RESPONSE VALIDATION SCHEMAS (STRUCTURED GEMINI OUTPUTS)
// ==============================================================================

// Crop Recommendation AI Response Schema
export const cropRecommendationResponseSchema = z.object({
  summary: z.string(),
  dataLimitations: z.array(z.string()).default([]),
  recommendations: z.array(z.object({
    cropName: z.string(),
    suitabilityScore: z.number().min(0).max(100),
    suitabilityLevel: z.enum(["high", "moderate", "low", "unfavorable"]),
    reason: z.string(),
    soilCompatibility: z.string(),
    climateCompatibility: z.string(),
    waterRequirement: z.string(),
    estimatedDurationDays: z.number().positive(),
    sowingPeriod: z.string(),
    risks: z.array(z.string()).default([]),
    nextSteps: z.array(z.string()).default([])
  })).min(1, "At least one crop recommendation required"),
  warnings: z.array(z.string()).default([]),
  expertConsultationRequired: z.boolean().default(false)
});

// Soil Analysis AI Response Schema
export const soilAnalysisResponseSchema = z.object({
  overallAssessment: z.string(),
  soilPHStatus: z.enum(["strongly acidic", "moderately acidic", "slightly acidic", "neutral", "slightly alkaline", "moderately alkaline", "strongly alkaline", "unknown"]),
  nutrientAssessment: z.object({
    nitrogen: z.string(),
    phosphorus: z.string(),
    potassium: z.string(),
    organicCarbon: z.string()
  }),
  potentialDeficiencies: z.array(z.string()).default([]),
  potentialExcesses: z.array(z.string()).default([]),
  suitableCrops: z.array(z.string()).default([]),
  improvementPractices: z.array(z.string()).default([]),
  additionalTestingRequired: z.array(z.string()).default([]),
  warnings: z.array(z.string()).default([])
});

// Fertilizer Advisory AI Response Schema
export const fertilizerResponseSchema = z.object({
  cropName: z.string(),
  growthStage: z.string(),
  nutrientAssessment: z.array(z.string()).default([]),
  recommendations: z.array(z.object({
    fertilizerCategory: z.string(),
    purpose: z.string(),
    applicationTiming: z.string(),
    applicationMethod: z.string(),
    quantity: z.string().nullable().optional(),
    quantityUnit: z.string().nullable().optional(),
    reason: z.string()
  })),
  safetyPrecautions: z.array(z.string()).default([]),
  dataLimitations: z.array(z.string()).default([]),
  warnings: z.array(z.string()).default([])
});

// Irrigation Advisory AI Response Schema
export const irrigationResponseSchema = z.object({
  cropName: z.string(),
  growthStage: z.string(),
  waterRequirement: z.string(),
  irrigationRecommendations: z.array(z.object({
    timing: z.string(),
    method: z.string(),
    reason: z.string()
  })),
  waterConservationMethods: z.array(z.string()).default([]),
  waterStressIndicators: z.array(z.string()).default([]),
  drainageAdvice: z.array(z.string()).default([]),
  dataLimitations: z.array(z.string()).default([]),
  warnings: z.array(z.string()).default([])
});

// Disease Detection AI Response Schema
export const diseaseResponseSchema = z.object({
  cropName: z.string(),
  possibleConditions: z.array(z.object({
    name: z.string(),
    confidenceLevel: z.enum(["low", "medium", "high", "tentative"]),
    supportingSymptoms: z.array(z.string()).default([]),
    alternativeCauses: z.array(z.string()).default([]),
    recommendedInspection: z.array(z.string()).default([])
  })),
  preventiveMeasures: z.array(z.string()).default([]),
  integratedPestManagement: z.array(z.string()).default([]),
  treatmentGuidance: z.array(z.string()).default([]),
  safetyWarnings: z.array(z.string()).default([]),
  expertConsultationRequired: z.boolean().default(true)
});

// Cultivation Calendar AI Response Schema
export const cultivationCalendarResponseSchema = z.object({
  cropName: z.string(),
  estimatedDurationDays: z.number().positive(),
  activities: z.array(z.object({
    stage: z.string(),
    dayFromStart: z.number().int().nonnegative(),
    dayToStart: z.number().int().nonnegative(),
    description: z.string(),
    importance: z.enum(["low", "medium", "high", "critical"]).default("medium"),
    completed: z.boolean().default(false)
  })),
  importantWarnings: z.array(z.string()).default([]),
  dataLimitations: z.array(z.string()).default([])
});

// Chatbot AI Response Schema
export const chatbotResponseSchema = z.object({
  answer: z.string(),
  language: z.string(),
  relatedTopics: z.array(z.string()).default([]),
  warnings: z.array(z.string()).default([]),
  requiresExpertConsultation: z.boolean().default(false)
});

