import React from "react";
import { NutrientStatusCard } from "./NutrientStatusCard";
import { AdvisoryWarning } from "../common/AdvisoryWarning";
import {
  FlaskConical,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Sprout,
  ArrowRight,
} from "lucide-react";

export const SoilHealthCard = ({ report }) => {
  const analysis = report.analysis || {};
  const nutrient = analysis.nutrientAssessment || {};

  const getPHColor = (phStatus = "") => {
    const s = phStatus.toLowerCase();
    if (s.includes("neutral") || s.includes("slightly")) {
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    }
    if (s.includes("acidic")) {
      return "bg-amber-100 text-amber-800 border-amber-200";
    }
    if (s.includes("alkaline")) {
      return "bg-purple-100 text-purple-800 border-purple-200";
    }
    return "bg-slate-100 text-slate-800 border-slate-200";
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-forest-100 text-forest-800">
              Soil Health Report
            </span>
            <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getPHColor(analysis.soilPHStatus)}`}>
              pH: {analysis.soilPHStatus || "Unknown"}
            </span>
          </div>
          <h3 className="text-lg font-black text-slate-900">
            Fertility & Diagnostic Summary
          </h3>
        </div>

        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
          <FlaskConical className="w-6 h-6" />
        </div>
      </div>

      {/* Overall Assessment prose */}
      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50/70 p-4 rounded-xl border border-slate-100">
        {analysis.overallAssessment}
      </p>

      {/* Nutrients Grid */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Primary Nutrient Levels
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <NutrientStatusCard
            label="Nitrogen"
            symbol="N"
            status={nutrient.nitrogen}
            unit="Available N"
          />
          <NutrientStatusCard
            label="Phosphorus"
            symbol="P"
            status={nutrient.phosphorus}
            unit="Available P"
          />
          <NutrientStatusCard
            label="Potassium"
            symbol="K"
            status={nutrient.potassium}
            unit="Available K"
          />
          <NutrientStatusCard
            label="Organic Carbon"
            symbol="OC"
            status={nutrient.organicCarbon}
            unit="Soil OC %"
          />
        </div>
      </div>

      {/* Deficiencies & Excesses */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Deficiencies */}
        <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-2">
          <h5 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            Potential Nutrient Deficiencies
          </h5>
          {analysis.potentialDeficiencies && analysis.potentialDeficiencies.length > 0 ? (
            <ul className="list-disc pl-5 text-xs text-amber-800 space-y-1">
              {analysis.potentialDeficiencies.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-500 italic">No severe deficiencies detected from provided data.</p>
          )}
        </div>

        {/* Improvement Practices */}
        <div className="p-4 rounded-xl border border-forest-200 bg-forest-50/50 space-y-2">
          <h5 className="text-xs font-bold uppercase tracking-wider text-forest-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-forest-600" />
            Recommended Soil Improvement
          </h5>
          {analysis.improvementPractices && analysis.improvementPractices.length > 0 ? (
            <ul className="list-disc pl-5 text-xs text-forest-800 space-y-1">
              {analysis.improvementPractices.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-500 italic">Standard organic maintenance recommended.</p>
          )}
        </div>
      </div>

      {/* Suitable Crops based on this soil */}
      {analysis.suitableCrops && analysis.suitableCrops.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <Sprout className="w-3.5 h-3.5 text-forest-600" />
            Crops Naturally Suited for this Soil Condition
          </h4>
          <div className="flex flex-wrap gap-2">
            {analysis.suitableCrops.map((crop, idx) => (
              <span
                key={idx}
                className="text-xs font-semibold px-3 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-200"
              >
                {crop}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Additional testing recommendations */}
      {analysis.additionalTestingRequired && analysis.additionalTestingRequired.length > 0 && (
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
          <span className="font-semibold text-slate-900 block mb-1">
            Recommended Additional Laboratory Tests:
          </span>
          <ul className="list-disc pl-5 space-y-0.5 text-slate-600">
            {analysis.additionalTestingRequired.map((test, idx) => (
              <li key={idx}>{test}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Scientific Warnings */}
      <AdvisoryWarning warnings={analysis.warnings} />
    </div>
  );
};

