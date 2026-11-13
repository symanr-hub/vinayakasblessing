import React from "react";
import { Link } from "react-router-dom";
import { EmptyState } from "../common/EmptyState";
import { CalendarDays, CheckCircle2, Clock, ArrowRight } from "lucide-react";

export const UpcomingTasks = ({ tasks = [] }) => {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900">Upcoming Farming Tasks</h3>
        </div>
        <EmptyState
          icon={CalendarDays}
          title="No active cultivation schedules"
          description="Generate a cultivation calendar for your crop to track milestones from sowing to harvest."
          actionLabel="Create Cultivation Calendar"
          onAction={() => window.location.href = "/cultivation-calendar"}
        />
      </div>
    );
  }

  const getImportanceBadge = (importance) => {
    switch (importance) {
      case "critical":
        return "bg-rose-100 text-rose-800 border-rose-200";
      case "high":
        return "bg-amber-100 text-amber-800 border-amber-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Upcoming Farming Tasks</h3>
          <p className="text-xs text-slate-500">Milestones from active cultivation calendars</p>
        </div>
        <Link
          to="/cultivation-calendar"
          className="text-xs font-semibold text-forest-700 hover:text-forest-800 flex items-center gap-1"
        >
          <span>All Schedules</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.activityId}
            className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors flex items-start justify-between gap-3"
          >
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-forest-900 bg-forest-100 px-2 py-0.5 rounded-md">
                  {task.cropName}
                </span>
                <span className="text-xs font-semibold text-slate-700">
                  {task.stage}
                </span>
                <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border ${getImportanceBadge(task.importance)}`}>
                  {task.importance}
                </span>
              </div>
              <p className="text-xs text-slate-600 line-clamp-2">
                {task.description}
              </p>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>Target: {task.targetStartDate}</span>
                {task.daysRemaining !== undefined && (
                  <span className="font-semibold text-slate-600">
                    ({task.daysRemaining > 0 ? `in ${task.daysRemaining} days` : task.daysRemaining === 0 ? "Today" : `${Math.abs(task.daysRemaining)} days ago`})
                  </span>
                )}
              </div>
            </div>

            <Link
              to="/cultivation-calendar"
              className="p-2 text-forest-600 hover:bg-forest-100 rounded-lg shrink-0 transition-colors"
              title="Open Calendar"
            >
              <CheckCircle2 className="w-5 h-5 text-slate-400 hover:text-forest-600" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

