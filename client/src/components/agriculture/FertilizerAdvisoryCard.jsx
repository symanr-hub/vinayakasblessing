import React from "react";
import { AdvisoryWarning } from "../common/AdvisoryWarning";
import { Wheat, ShieldAlert, Sparkles, CheckCircle } from "lucide-react";

export const FertilizerAdvisoryCard = ({ advisory }) => {
  const data = advisory.advisory || {};
  const recommendations = data.recommendations || [];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-yellow-100 text-yellow-800">
              Nutrient Management
            </span>
            <span className="text-xs font-semibold text-slate-500">
              Stage: <b>{data.growthStage || "Vegetative"}</b>
            </span>
          </div>
          <h3 className="text-xl font-black text-slate-900">
            {advisory.crop_name || data.cropName} Fertilizer Advisory
          </h3>
        </div>

        <div className="w-12 h-12 rounded-2xl bg-yellow-50 text-yellow-700 flex items-center justify-center shrink-0">
          <Wheat className="w-6 h-6" />
        </div>
      </div>

      {/* Nutrient Assessment bullets */}
      {data.nutrientAssessment && data.nutrientAssessment.length > 0 && (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
          <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
            Stage Nutrient Demand & Evaluation:
          </h4>
          <ul className="list-disc pl-5 text-slate-700 space-y-1">
            {data.nutrientAssessment.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendations Table / Grid */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Fertilizer & Nutrition Schedule
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((rec, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors space-y-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-forest-100 text-forest-800">
                  {rec.fertilizerCategory}
                </span>
                {rec.quantity && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-900">
                    {rec.quantity} {rec.quantityUnit || ""}
                  </span>
                )}
              </div>

              <h5 className="text-sm font-bold text-slate-900">
                {rec.purpose}
              </h5>

              <p className="text-xs text-slate-600 leading-relaxed">
                {rec.reason}
              </p>

              <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] text-slate-500">
                <div>
                  <span className="font-semibold text-slate-700 block">Timing:</span>
                  <span>{rec.applicationTiming}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-700 block">Method:</span>
                  <span>{rec.applicationMethod}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Safety Precautions */}
      {data.safetyPrecautions && data.safetyPrecautions.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            Chemical & Fertilizer Safety Precautions
          </h4>
          <ul className="list-disc pl-5 text-xs text-amber-900 space-y-0.5">
            {data.safetyPrecautions.map((safe, idx) => (
              <li key={idx}>{safe}</li>
            ))}
          </ul>
        </div>
      )}

      <AdvisoryWarning
        warnings={data.warnings}
        dataLimitations={data.dataLimitations}
      />
    </div>
  );
};

