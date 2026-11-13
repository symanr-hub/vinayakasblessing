import React from "react";
import { AdvisoryWarning } from "../common/AdvisoryWarning";
import {
  Bug,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  Eye,
  Sparkles,
} from "lucide-react";

export const DiseaseResultCard = ({ report }) => {
  const analysis = report.analysis || {};
  const possibleConditions = analysis.possibleConditions || [];

  const getConfidenceBadge = (confidence = "medium") => {
    switch (confidence.toLowerCase()) {
      case "high":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "medium":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "tentative":
      case "low":
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800">
              Pathology & Pest Diagnostic
            </span>
            <span className="text-xs font-semibold text-slate-500">
              Crop: <b>{report.crop_name}</b>
            </span>
          </div>
          <h3 className="text-xl font-black text-slate-900">
            Plant Health & Diagnostic Report
          </h3>
        </div>

        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
          <Bug className="w-6 h-6" />
        </div>
      </div>

      {/* Uploaded Crop Image if present */}
      {report.signed_image_url && (
        <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-900/5 max-h-72 flex items-center justify-center p-2">
          <img
            src={report.signed_image_url}
            alt="Inspected crop sample"
            className="max-h-64 object-contain rounded-xl"
          />
        </div>
      )}

      {/* Possible Conditions */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Identified Potential Conditions & Pest Threats
        </h4>

        <div className="space-y-4">
          {possibleConditions.map((cond, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h5 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span>{cond.name}</span>
                </h5>
                <span className={`inline-block text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getConfidenceBadge(cond.confidenceLevel)}`}>
                  Confidence: {cond.confidenceLevel}
                </span>
              </div>

              {/* Supporting symptoms */}
              {cond.supportingSymptoms && cond.supportingSymptoms.length > 0 && (
                <div className="text-xs">
                  <span className="font-semibold text-slate-700 block mb-1">
                    Matching Symptoms:
                  </span>
                  <ul className="list-disc pl-5 text-slate-600 space-y-0.5">
                    {cond.supportingSymptoms.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Alternative causes */}
              {cond.alternativeCauses && cond.alternativeCauses.length > 0 && (
                <div className="text-xs bg-white p-3 rounded-xl border border-slate-200">
                  <span className="font-semibold text-slate-800 flex items-center gap-1 mb-1">
                    <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                    Alternative Possible Causes (Rule Out):
                  </span>
                  <p className="text-slate-600">
                    {cond.alternativeCauses.join(", ")}
                  </p>
                </div>
              )}

              {/* Recommended inspection steps */}
              {cond.recommendedInspection && cond.recommendedInspection.length > 0 && (
                <div className="text-xs">
                  <span className="font-semibold text-slate-700 flex items-center gap-1 mb-1">
                    <Eye className="w-3.5 h-3.5 text-forest-600" />
                    On-Field Inspection Steps:
                  </span>
                  <ul className="list-decimal pl-5 text-slate-600 space-y-0.5">
                    {cond.recommendedInspection.map((ins, i) => (
                      <li key={i}>{ins}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Integrated Pest Management (IPM) & Prevention */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* IPM */}
        <div className="p-4 rounded-xl border border-forest-200 bg-forest-50/50 space-y-2">
          <h5 className="text-xs font-bold uppercase tracking-wider text-forest-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-forest-600" />
            Integrated Pest Management (IPM)
          </h5>
          {analysis.integratedPestManagement && analysis.integratedPestManagement.length > 0 ? (
            <ul className="list-disc pl-5 text-xs text-forest-800 space-y-1">
              {analysis.integratedPestManagement.map((ipm, idx) => (
                <li key={idx}>{ipm}</li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-500 italic">Promote beneficial insects and yellow sticky traps.</p>
          )}
        </div>

        {/* Preventive cultural practices */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-forest-600" />
            Cultural Preventive Practices
          </h5>
          {analysis.preventiveMeasures && analysis.preventiveMeasures.length > 0 ? (
            <ul className="list-disc pl-5 text-xs text-slate-700 space-y-1">
              {analysis.preventiveMeasures.map((pm, idx) => (
                <li key={idx}>{pm}</li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-500 italic">Sanitize farm tools and ensure field drainage.</p>
          )}
        </div>
      </div>

      {/* Treatment guidance */}
      {analysis.treatmentGuidance && analysis.treatmentGuidance.length > 0 && (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900">
            Safe Treatment Guidelines (Follow Product Labels)
          </h5>
          <ul className="list-disc pl-5 text-xs text-slate-700 space-y-1">
            {analysis.treatmentGuidance.map((tg, idx) => (
              <li key={idx}>{tg}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Safety Notice & Warning */}
      <AdvisoryWarning
        warnings={analysis.safetyWarnings}
        expertRequired={analysis.expertConsultationRequired}
      />
    </div>
  );
};

