import React from "react";

export const CropSuitabilityIndicator = ({ score = 85, level = "high" }) => {
  const getBadgeStyle = (lvl) => {
    switch (lvl) {
      case "high":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "moderate":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "low":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "unfavorable":
        return "bg-rose-100 text-rose-800 border-rose-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getStrokeColor = (sc) => {
    if (sc >= 75) return "#16a34a"; // green
    if (sc >= 50) return "#eab308"; // yellow
    if (sc >= 35) return "#f97316"; // orange
    return "#dc2626"; // red
  };

  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;

  return (
    <div className="flex items-center gap-3">
      <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
        <svg className="w-14 h-14 -rotate-90" viewBox="0 0 60 60">
          <circle
            cx="30"
            cy="30"
            r={radius}
            stroke="#e2e8f0"
            strokeWidth="5"
            fill="transparent"
          />
          <circle
            cx="30"
            cy="30"
            r={radius}
            stroke={getStrokeColor(score)}
            strokeWidth="5"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <span className="absolute text-xs font-black text-slate-800">
          {score}
        </span>
      </div>

      <div>
        <div className="text-[10px] uppercase font-bold text-slate-400">Suitability</div>
        <span className={`inline-block text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${getBadgeStyle(level)}`}>
          {level}
        </span>
      </div>
    </div>
  );
};

