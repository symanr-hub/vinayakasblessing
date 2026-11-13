import React from "react";

export const NutrientStatusCard = ({ label, status, symbol, unit = "kg/ha" }) => {
  const getStatusColor = (st = "") => {
    const s = st.toLowerCase();
    if (s.includes("optimal") || s.includes("adequate") || s.includes("good")) {
      return { bg: "bg-emerald-50", text: "text-emerald-800", border: "border-emerald-200", dot: "bg-emerald-500" };
    }
    if (s.includes("medium") || s.includes("moderate")) {
      return { bg: "bg-sky-50", text: "text-sky-800", border: "border-sky-200", dot: "bg-sky-500" };
    }
    if (s.includes("low") || s.includes("deficient")) {
      return { bg: "bg-amber-50", text: "text-amber-800", border: "border-amber-200", dot: "bg-amber-500" };
    }
    if (s.includes("high") || s.includes("excess")) {
      return { bg: "bg-rose-50", text: "text-rose-800", border: "border-rose-200", dot: "bg-rose-500" };
    }
    return { bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200", dot: "bg-slate-400" };
  };

  const style = getStatusColor(status);

  return (
    <div className={`p-4 rounded-xl border ${style.border} ${style.bg} flex items-center justify-between`}>
      <div className="space-y-0.5">
        <div className="flex items-center gap-1.5">
          <span className="w-5 h-5 rounded-md bg-white border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-800">
            {symbol}
          </span>
          <span className="text-xs font-bold text-slate-800">{label}</span>
        </div>
        <p className="text-[10px] text-slate-500">{unit}</p>
      </div>

      <div className="flex items-center gap-1.5">
        <span className={`w-2 h-2 rounded-full ${style.dot}`} />
        <span className={`text-xs font-bold ${style.text}`}>{status || "Not tested"}</span>
      </div>
    </div>
  );
};

