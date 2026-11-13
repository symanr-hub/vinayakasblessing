import axios from "axios";
import { supabase } from "./supabase";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 45000, // 45 seconds for AI generation tasks
});

// Interceptor to inject Supabase JWT access token into Authorization header
apiClient.interceptors.request.use(async (config) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
  } catch (err) {
    console.error("Error retrieving Supabase session for API request:", err);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor to extract clean server messages
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const serverMessage =
      error.response?.data?.message ||
      error.response?.data?.error?.details ||
      error.message ||
      "An unexpected server error occurred";

    const customError = new Error(serverMessage);
    customError.status = error.response?.status;
    customError.data = error.response?.data;
    return Promise.reject(customError);
  }
);

export const api = {
  // 1. Profile
  getProfile: () => apiClient.get("/profile"),
  updateProfile: (profileData) => apiClient.put("/profile", profileData),

  // 2. Farms
  getFarms: () => apiClient.get("/farms"),
  getFarmById: (id) => apiClient.get(`/farms/${id}`),
  createFarm: (farmData) => apiClient.post("/farms", farmData),
  updateFarm: (id, farmData) => apiClient.put(`/farms/${id}`, farmData),
  deleteFarm: (id) => apiClient.delete(`/farms/${id}`),

  // 3. Crop Recommendation
  recommendCrop: (data) => apiClient.post("/crop/recommend", data),
  getCropRecommendations: (params) => apiClient.get("/crop/recommendations", { params }),
  getCropRecommendationById: (id) => apiClient.get(`/crop/recommendations/${id}`),
  deleteCropRecommendation: (id) => apiClient.delete(`/crop/recommendations/${id}`),

  // 4. Soil Analysis
  analyzeSoil: (data) => apiClient.post("/soil/analyze", data),
  getSoilReports: (params) => apiClient.get("/soil/reports", { params }),
  getSoilReportById: (id) => apiClient.get(`/soil/reports/${id}`),
  deleteSoilReport: (id) => apiClient.delete(`/soil/reports/${id}`),

  // 5. Fertilizer Advisory
  recommendFertilizer: (data) => apiClient.post("/fertilizer/recommend", data),
  getFertilizerAdvisories: (params) => apiClient.get("/fertilizer/advisories", { params }),
  getFertilizerAdvisoryById: (id) => apiClient.get(`/fertilizer/advisories/${id}`),
  deleteFertilizerAdvisory: (id) => apiClient.delete(`/fertilizer/advisories/${id}`),

  // 6. Irrigation Advisory
  recommendIrrigation: (data) => apiClient.post("/irrigation/recommend", data),
  getIrrigationAdvisories: (params) => apiClient.get("/irrigation/advisories", { params }),
  getIrrigationAdvisoryById: (id) => apiClient.get(`/irrigation/advisories/${id}`),
  deleteIrrigationAdvisory: (id) => apiClient.delete(`/irrigation/advisories/${id}`),

  // 7. Disease Detection
  analyzeDisease: (formData) => apiClient.post("/disease/analyze", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }),
  getDiseaseReports: (params) => apiClient.get("/disease/reports", { params }),
  getDiseaseReportById: (id) => apiClient.get(`/disease/reports/${id}`),
  deleteDiseaseReport: (id) => apiClient.delete(`/disease/reports/${id}`),

  // 8. Cultivation Calendar
  generateCalendar: (data) => apiClient.post("/calendar/generate", data),
  getCalendars: (params) => apiClient.get("/calendar", { params }),
  getCalendarById: (id) => apiClient.get(`/calendar/${id}`),
  updateCalendarActivities: (id, activities) => apiClient.put(`/calendar/${id}`, { activities }),
  deleteCalendar: (id) => apiClient.delete(`/calendar/${id}`),

  // 9. Chatbot Assistant
  createConversation: (data) => apiClient.post("/chat/conversations", data),
  getConversations: () => apiClient.get("/chat/conversations"),
  getConversationById: (id) => apiClient.get(`/chat/conversations/${id}`),
  sendChatMessage: (conversationId, messageData) => apiClient.post(`/chat/conversations/${conversationId}/messages`, messageData),
  deleteConversation: (id) => apiClient.delete(`/chat/conversations/${id}`),

  // 10. Dashboard
  getDashboardSummary: () => apiClient.get("/dashboard/summary"),
  getRecentActivities: () => apiClient.get("/dashboard/recent-activities"),
  getUpcomingTasks: () => apiClient.get("/dashboard/upcoming-tasks"),

  // 11. Health
  checkHealth: () => apiClient.get("/health"),
};

export default api;

