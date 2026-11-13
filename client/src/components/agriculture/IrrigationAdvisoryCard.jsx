import React from "react";
import { AdvisoryWarning } from "../common/AdvisoryWarning";
import { Droplets, Clock, AlertTriangle, ShieldCheck, Waves } from "lucide-react";

export const IrrigationAdvisoryCard = ({ advisory }) => {
  const data = advisory.advisory || {};
  const recommendations = data.irrigationRecommendations || [];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800">
              Irrigation Guidance
            </span>
            <span className="text-xs font-semibold text-slate-500">
              Stage: <b>{data.growthStage}</b>
            </span>
          </div>
          <h3 className="text-xl font-black text-slate-900">
            {advisory.crop_name || data.cropName} Water Management
          </h3>
        </div>

        <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
          <Droplets className="w-6 h-6" />
        </div>
      </div>

      {/* Water Requirement banner */}
      <div className="p-4 rounded-xl bg-sky-50/70 border border-sky-200 flex items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-900 block">
            Current Stage Water Requirement
          </span>
          <p className="text-sm font-bold text-sky-950 mt-0.5">
            {data.waterRequirement}
          </p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center text-sky-700 shrink-0">
          <Waves className="w-5 h-5" />
        </div>
      </div>

      {/* Irrigation Recommendations */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Irrigation Schedule & Delivery Methods
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {recommendations.map((rec, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors space-y-2"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <Clock className="w-4 h-4 text-sky-600" />
                <span>{rec.timing}</span>
              </div>
              <p className="text-xs font-semibold text-forest-700 bg-forest-50 px-2 py-0.5 rounded-md inline-block">
                Method: {rec.method}
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                {rec.reason}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Water Stress & Drainage */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Stress indicators */}
        <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-2">
          <h5 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            Crop Water Stress Indicators
          </h5>
          {data.waterStressIndicators && data.waterStressIndicators.length > 0 ? (
            <ul className="list-disc pl-5 text-xs text-amber-800 space-y-1">
              {data.waterStressIndicators.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-500 italic">Watch for wilting during peak afternoon hours.</p>
          )}
        </div>

        {/* Conservation & Drainage */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-forest-600" />
            Conservation & Drainage Methods
          </h5>
          {data.waterConservationMethods && data.waterConservationMethods.length > 0 ? (
            <ul className="list-disc pl-5 text-xs text-slate-700 space-y-1">
              {data.waterConservationMethods.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          ) : null}
          {data.drainageAdvice && data.drainageAdvice.length > 0 && (
            <div className="pt-2 border-t border-slate-200 text-xs text-slate-600">
              <span className="font-semibold block text-slate-700">Drainage Tip:</span>
              <span>{data.drainageAdvice.join("; ")}</span>
            </div>
          )}
        </div>
      </div>

      <AdvisoryWarning
        warnings={data.warnings}
        dataLimitations={data.dataLimitations}
      />
    </div>
  );
};

