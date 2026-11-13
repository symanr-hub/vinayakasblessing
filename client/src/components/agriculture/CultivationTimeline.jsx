import React, { useState } from "react";
import { addDays, format, parseISO } from "date-fns";
import {
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import { Button } from "../common/Button";

export const CultivationTimeline = ({
  calendar,
  onToggleActivity,
  saving = false,
}) => {
  const activitiesObj = calendar.activities || {};
  const activitiesList = activitiesObj.activities || [];
  const startDate = parseISO(calendar.start_date || new Date().toISOString().split("T")[0]);

  const [localActivities, setLocalActivities] = useState(activitiesList);

  const handleToggle = (index) => {
    const updated = [...localActivities];
    updated[index].completed = !updated[index].completed;
    setLocalActivities(updated);
    if (onToggleActivity) {
      onToggleActivity(updated);
    }
  };

  const completedCount = localActivities.filter((a) => a.completed).length;
  const progressPercent = localActivities.length > 0
    ? Math.round((completedCount / localActivities.length) * 100)
    : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
      {/* Header with Progress */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
              Cultivation Calendar
            </span>
            <span className="text-xs font-semibold text-slate-500">
              Started: <b>{format(startDate, "MMM dd, yyyy")}</b> • Total Duration: <b>{activitiesObj.estimatedDurationDays || 120} days</b>
            </span>
          </div>
          <h3 className="text-xl font-black text-slate-900">
            {calendar.crop_name} Production Roadmap
          </h3>
        </div>

        {/* Completion Progress Gauge */}
        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
          <div className="text-right">
            <div className="text-xs font-bold text-slate-800">
              {completedCount} / {localActivities.length} Milestones
            </div>
            <div className="text-[10px] text-slate-500 font-medium">
              {progressPercent}% Complete
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-indigo-50 border-2 border-indigo-200 flex items-center justify-center font-black text-xs text-indigo-700">
            {progressPercent}%
          </div>
        </div>
      </div>

      {/* Timeline Steps */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
        {localActivities.map((act, idx) => {
          const actStartDate = addDays(startDate, act.dayFromStart);
          const actEndDate = addDays(startDate, act.dayToStart);

          return (
            <div key={act.id || idx} className="relative group">
              {/* Timeline marker icon */}
              <button
                type="button"
                onClick={() => handleToggle(idx)}
                className={`absolute -left-6 top-1 w-5 h-5 rounded-full bg-white flex items-center justify-center transition-colors cursor-pointer ${
                  act.completed
                    ? "text-emerald-600 ring-4 ring-emerald-50"
                    : "text-slate-300 hover:text-indigo-600 ring-4 ring-white"
                }`}
                title="Mark activity completed"
              >
                {act.completed ? (
                  <CheckCircle2 className="w-5 h-5 fill-emerald-600 text-white" />
                ) : (
                  <Circle className="w-5 h-5 stroke-[2.5]" />
                )}
              </button>

              <div
                className={`p-4 rounded-xl border transition-all ${
                  act.completed
                    ? "bg-slate-50/80 border-slate-200 opacity-75"
                    : "bg-white border-slate-200 shadow-xs hover:border-slate-300"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">
                      Day {act.dayFromStart} - {act.dayToStart}:
                    </span>
                    <span className={`text-xs font-bold ${act.completed ? "line-through text-slate-500" : "text-forest-900"}`}>
                      {act.stage}
                    </span>
                  </div>

                  <span className="text-[11px] text-slate-400 font-medium">
                    {format(actStartDate, "MMM dd")} – {format(actEndDate, "MMM dd, yyyy")}
                  </span>
                </div>

                <p className={`text-xs leading-relaxed ${act.completed ? "line-through text-slate-400" : "text-slate-600"}`}>
                  {act.description}
                </p>

                <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-100 text-[11px]">
                  <span className={`font-semibold uppercase tracking-wider text-[10px] px-2 py-0.5 rounded-full ${
                    act.importance === "high" || act.importance === "critical"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-slate-100 text-slate-600"
                  }`}>
                    Priority: {act.importance || "medium"}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleToggle(idx)}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    {act.completed ? "Mark Incomplete" : "Mark Completed ✓"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Warnings & Data Limitations */}
      {activitiesObj.importantWarnings && activitiesObj.importantWarnings.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
          <div className="font-bold flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            Seasonal & Timeliness Alerts:
          </div>
          <ul className="list-disc pl-5 space-y-0.5 text-amber-800">
            {activitiesObj.importantWarnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

