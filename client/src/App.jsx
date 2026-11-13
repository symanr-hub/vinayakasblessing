import React from "react";
import { Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";

// Public Pages
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { NotFoundPage } from "./pages/NotFoundPage";

// Protected Farmer Dashboard Pages
import { DashboardPage } from "./pages/DashboardPage";
import { ProfilePage } from "./pages/ProfilePage";
import { FarmsPage } from "./pages/FarmsPage";
import { CropRecommendationPage } from "./pages/CropRecommendationPage";
import { SoilAnalysisPage } from "./pages/SoilAnalysisPage";
import { FertilizerPage } from "./pages/FertilizerPage";
import { IrrigationPage } from "./pages/IrrigationPage";
import { DiseaseDetectionPage } from "./pages/DiseaseDetectionPage";
import { CalendarPage } from "./pages/CalendarPage";
import { AssistantPage } from "./pages/AssistantPage";
import { HistoryPage } from "./pages/HistoryPage";
import { AdvisoryDetailsPage } from "./pages/AdvisoryDetailsPage";
import { SettingsPage } from "./pages/SettingsPage";

export default function App() {
  return (
    <Routes>
      {/* Public Pages with Main Layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Protected Farmer Pages with Dashboard Layout */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/farms" element={<FarmsPage />} />
        <Route path="/crop-recommendation" element={<CropRecommendationPage />} />
        <Route path="/soil-analysis" element={<SoilAnalysisPage />} />
        <Route path="/fertilizer-advisory" element={<FertilizerPage />} />
        <Route path="/irrigation-advisory" element={<IrrigationPage />} />
        <Route path="/disease-detection" element={<DiseaseDetectionPage />} />
        <Route path="/cultivation-calendar" element={<CalendarPage />} />
        <Route path="/ai-assistant" element={<AssistantPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/history/:id" element={<AdvisoryDetailsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}

