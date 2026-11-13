import React, { useState } from "react";
import { api } from "../services/api";
import { CropRecommendationForm } from "../components/agriculture/CropRecommendationForm";
import { CropRecommendationCard } from "../components/agriculture/CropRecommendationCard";
import { AdvisoryWarning } from "../components/common/AdvisoryWarning";
import { Button } from "../components/common/Button";
import { Sprout, RefreshCw, AlertCircle } from "lucide-react";

export const CropRecommendationPage = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerate = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.recommendCrop(formData);
      setResult(res.data);
    } catch (err) {
      console.error("Crop advisory generation error:", err);
      setError(err.message || "Failed to generate crop recommendations. Please check inputs and server connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  const recommendations = result?.recommendations?.recommendations || [];
  const limitations = result?.recommendations?.dataLimitations || [];
  const warnings = result?.recommendations?.warnings || [];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-forest-100 text-forest-800">
              Crop Advisory Engine
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            AI Crop Recommendation
          </h2>
          <p className="text-xs text-slate-500">
            Synthesize soil characteristics, agro-climatic conditions, and regional sowing windows to find optimal crops.
          </p>
        </div>

        {result && (
          <Button variant="outline" size="sm" icon={RefreshCw} onClick={handleReset}>
            New Crop Analysis
          </Button>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold">Recommendation Generation Failed</h4>
            <p className="mt-0.5 leading-relaxed">{error}</p>
          </div>
        </div>
      )}

      {/* Form or Results */}
      {!result ? (
        <CropRecommendationForm onSubmit={handleGenerate} loading={loading} />
      ) : (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Summary Box */}
          <div className="p-6 rounded-2xl bg-forest-900 text-white shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-harvest-400 text-xs font-bold uppercase tracking-wider">
              <Sprout className="w-4 h-4" />
              <span>AgroAI Recommendation Summary</span>
            </div>
            <h3 className="text-xl font-bold tracking-tight">
              {result.recommendations?.summary || "Regionally viable crop selections based on your field data."}
            </h3>
            <p className="text-xs text-slate-300">
              Generated for {result.input_data?.district}, {result.input_data?.state} • {result.input_data?.season} Season
            </p>
          </div>

          {/* Cards List */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Recommended Crops ({recommendations.length} Options)
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {recommendations.map((rec, idx) => (
                <CropRecommendationCard key={idx} recommendation={rec} />
              ))}
            </div>
          </div>

          {/* Warnings & Next Steps */}
          <AdvisoryWarning
            warnings={warnings}
            dataLimitations={limitations}
            expertRequired={result.recommendations?.expertConsultationRequired}
          />
        </div>
      )}
    </div>
  );
};

