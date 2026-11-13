import React from "react";
import { Link } from "react-router-dom";
import { format, parseISO } from "date-fns";
import {
  Sprout,
  FlaskConical,
  Wheat,
  Droplets,
  Bug,
  CalendarDays,
  Trash2,
  ExternalLink,
} from "lucide-react";

export const AdvisoryHistoryCard = ({ item, onDelete }) => {
  const getIcon = (type) => {
    switch (type) {
      case "crop":
        return <Sprout className="w-5 h-5 text-emerald-600" />;
      case "soil":
        return <FlaskConical className="w-5 h-5 text-amber-600" />;
      case "fertilizer":
        return <Wheat className="w-5 h-5 text-yellow-600" />;
      case "irrigation":
        return <Droplets className="w-5 h-5 text-sky-600" />;
      case "disease":
        return <Bug className="w-5 h-5 text-rose-600" />;
      case "calendar":
        return <CalendarDays className="w-5 h-5 text-indigo-600" />;
      default:
        return <Sprout className="w-5 h-5 text-forest-600" />;
    }
  };

  const getBadgeClass = (type) => {
    switch (type) {
      case "crop":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "soil":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "fertilizer":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "irrigation":
        return "bg-sky-100 text-sky-800 border-sky-200";
      case "disease":
        return "bg-rose-100 text-rose-800 border-rose-200";
      case "calendar":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  let formattedDate = "";
  try {
    if (item.created_at) {
      formattedDate = format(parseISO(item.created_at), "MMMM dd, yyyy • h:mm a");
    }
  } catch (e) {
    // fallback
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
              {getIcon(item.type)}
            </div>
            <div>
              <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getBadgeClass(item.type)}`}>
                {item.type}
              </span>
              <p className="text-[11px] text-slate-400 mt-0.5">{formattedDate}</p>
            </div>
          </div>

          <button
            onClick={() => onDelete(item)}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Delete this advisory"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div>
          <h4 className="text-sm font-bold text-slate-900 leading-snug">
            {item.title}
          </h4>
          {item.summary && (
            <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
              {item.summary}
            </p>
          )}
        </div>
      </div>

      <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] text-slate-400">
          {item.detailsCount || "1 Report Generated"}
        </span>
        <Link
          to={`/history/${item.id}?type=${item.type}`}
          className="text-xs font-semibold text-forest-700 hover:text-forest-900 flex items-center gap-1 group"
        >
          <span>View Details</span>
          <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

