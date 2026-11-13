import React, { useState } from "react";
import { CropSuitabilityIndicator } from "./CropSuitabilityIndicator";
import {
  Calendar,
  Droplets,
  Layers,
  ThermometerSun,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export const CropRecommendationCard = ({ recommendation }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h4 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>{recommendation.cropName}</span>
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Estimated duration: <b>{recommendation.estimatedDurationDays} days</b> • Sowing: <b>{recommendation.sowingPeriod}</b>
          </p>
        </div>

        <CropSuitabilityIndicator
          score={recommendation.suitabilityScore}
          level={recommendation.suitabilityLevel}
        />
      </div>

      {/* Primary explanation */}
      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed my-3">
        {recommendation.reason}
      </p>

      {/* Compatibility Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 my-3 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
        <div className="flex items-start gap-2">
          <Layers className="w-4 h-4 text-forest-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-700 block">Soil Compatibility</span>
            <span className="text-slate-500">{recommendation.soilCompatibility}</span>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <ThermometerSun className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-700 block">Climate Compatibility</span>
            <span className="text-slate-500">{recommendation.climateCompatibility}</span>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Droplets className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-700 block">Water Need</span>
            <span className="text-slate-500">{recommendation.waterRequirement}</span>
          </div>
        </div>
      </div>

      {/* Expandable Details: Risks and Next Steps */}
      {expanded && (
        <div className="mt-4 pt-4 border-t border-slate-100 space-y-4 animate-in fade-in duration-200">
          {recommendation.risks && recommendation.risks.length > 0 && (
            <div className="space-y-1.5">
              <h5 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                Cultivation Risks & Challenges
              </h5>
              <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1">
                {recommendation.risks.map((risk, idx) => (
                  <li key={idx}>{risk}</li>
                ))}
              </ul>
            </div>
          )}

          {recommendation.nextSteps && recommendation.nextSteps.length > 0 && (
            <div className="space-y-1.5">
              <h5 className="text-xs font-bold uppercase tracking-wider text-forest-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-forest-600" />
                Recommended Next Steps
              </h5>
              <ul className="list-decimal pl-5 text-xs text-slate-600 space-y-1">
                {recommendation.nextSteps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Toggle button */}
      <div className="flex justify-end pt-2">
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs font-semibold text-forest-700 hover:text-forest-800 flex items-center gap-1 transition-colors"
        >
          <span>{expanded ? "Show Less" : "View Cultivation Risks & Next Steps"}</span>
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
};

