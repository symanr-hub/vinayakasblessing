import React, { useState } from "react";
import { api } from "../services/api";
import { SoilAnalysisForm } from "../components/agriculture/SoilAnalysisForm";
import { SoilHealthCard } from "../components/agriculture/SoilHealthCard";
import { Button } from "../components/common/Button";
import { FlaskConical, RefreshCw, AlertCircle } from "lucide-react";

export const SoilAnalysisPage = () => {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.analyzeSoil(formData);
      setReport(res.data);
    } catch (err) {
      console.error("Soil analysis error:", err);
      setError(err.message || "Failed to analyze soil parameters.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setReport(null);
    setError(null);
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
              Soil Science Engine
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Soil Health & Fertility Diagnostic
          </h2>
          <p className="text-xs text-slate-500">
            Analyze laboratory soil metrics (pH, N-P-K, EC, organic carbon) to detect deficiencies and receive organic improvement strategies.
          </p>
        </div>

        {report && (
          <Button variant="outline" size="sm" icon={RefreshCw} onClick={handleReset}>
            New Soil Test
          </Button>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold">Soil Analysis Failed</h4>
            <p className="mt-0.5 leading-relaxed">{error}</p>
          </div>
        </div>
      )}

      {!report ? (
        <SoilAnalysisForm onSubmit={handleAnalyze} loading={loading} />
      ) : (
        <div className="space-y-6 animate-in fade-in duration-300">
          <SoilHealthCard report={report} />
        </div>
      )}
    </div>
  );
};

