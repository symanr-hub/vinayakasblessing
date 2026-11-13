import React from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow, parseISO } from "date-fns";
import { EmptyState } from "../common/EmptyState";
import {
  Sprout,
  FlaskConical,
  Wheat,
  Droplets,
  Bug,
  CalendarDays,
  ArrowRight,
} from "lucide-react";

export const RecentAdvisories = ({ activities = [] }) => {
  const getIcon = (type) => {
    switch (type) {
      case "crop":
        return <Sprout className="w-4 h-4 text-emerald-600" />;
      case "soil":
        return <FlaskConical className="w-4 h-4 text-amber-600" />;
      case "fertilizer":
        return <Wheat className="w-4 h-4 text-yellow-600" />;
      case "irrigation":
        return <Droplets className="w-4 h-4 text-sky-600" />;
      case "disease":
        return <Bug className="w-4 h-4 text-rose-600" />;
      case "calendar":
        return <CalendarDays className="w-4 h-4 text-indigo-600" />;
      default:
        return <Sprout className="w-4 h-4 text-forest-600" />;
    }
  };

  const getBadge = (type) => {
    switch (type) {
      case "crop":
        return "bg-emerald-100 text-emerald-800";
      case "soil":
        return "bg-amber-100 text-amber-800";
      case "fertilizer":
        return "bg-yellow-100 text-yellow-800";
      case "irrigation":
        return "bg-sky-100 text-sky-800";
      case "disease":
        return "bg-rose-100 text-rose-800";
      case "calendar":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  if (!activities || activities.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900">Recent Advisories</h3>
        </div>
        <EmptyState
          title="No generated advisories yet"
          description="Your generated crop recommendations and soil health reports will appear here."
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Recent Advisories</h3>
          <p className="text-xs text-slate-500">Live records from your agricultural history</p>
        </div>
        <Link
          to="/history"
          className="text-xs font-semibold text-forest-700 hover:text-forest-800 flex items-center gap-1"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="divide-y divide-slate-100">
        {activities.map((item) => {
          let timeAgo = "recently";
          try {
            timeAgo = formatDistanceToNow(parseISO(item.created_at), { addSuffix: true });
          } catch (e) {
            // fallback
          }

          return (
            <div
              key={`${item.type}-${item.id}`}
              className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/70 rounded-xl px-2 -mx-2 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                  {getIcon(item.type)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${getBadge(item.type)}`}>
                      {item.type}
                    </span>
                    <span className="text-[11px] text-slate-400">{timeAgo}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5">
                    {item.title}
                  </h4>
                  {item.subtitle && (
                    <p className="text-[11px] text-slate-500 truncate">{item.subtitle}</p>
                  )}
                </div>
              </div>

              <Link
                to={item.link}
                className="shrink-0 p-2 text-slate-400 hover:text-forest-700 hover:bg-slate-100 rounded-lg transition-colors"
                title="View Full Report"
              >
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

