import React from "react";
import { Link } from "react-router-dom";
import {
  Sprout,
  FlaskConical,
  Wheat,
  Droplets,
  Bug,
  CalendarDays,
  Bot,
  ArrowRight,
} from "lucide-react";

export const QuickActionCard = () => {
  const actions = [
    {
      title: "Crop Advisory",
      description: "Find high-yield suitable crops for your soil and season",
      link: "/crop-recommendation",
      icon: Sprout,
      color: "bg-emerald-50 text-emerald-700 hover:border-emerald-300",
      iconBg: "bg-emerald-100 text-emerald-700",
    },
    {
      title: "Soil Health Check",
      description: "Analyze pH, N-P-K levels & nutrient deficiency solutions",
      link: "/soil-analysis",
      icon: FlaskConical,
      color: "bg-amber-50 text-amber-700 hover:border-amber-300",
      iconBg: "bg-amber-100 text-amber-700",
    },
    {
      title: "Fertilizer Schedule",
      description: "Crop-stage balanced fertilization & safety guidance",
      link: "/fertilizer-advisory",
      icon: Wheat,
      color: "bg-yellow-50 text-yellow-800 hover:border-yellow-300",
      iconBg: "bg-yellow-100 text-yellow-800",
    },
    {
      title: "Irrigation Advisory",
      description: "Crop water requirements & water conservation timing",
      link: "/irrigation-advisory",
      icon: Droplets,
      color: "bg-sky-50 text-sky-700 hover:border-sky-300",
      iconBg: "bg-sky-100 text-sky-700",
    },
    {
      title: "Disease & Pest Detection",
      description: "Identify plant symptoms & IPM biological protection",
      link: "/disease-detection",
      icon: Bug,
      color: "bg-rose-50 text-rose-700 hover:border-rose-300",
      iconBg: "bg-rose-100 text-rose-700",
    },
    {
      title: "Cultivation Calendar",
      description: "Generate chronological farm task timeline to harvest",
      link: "/cultivation-calendar",
      icon: CalendarDays,
      color: "bg-indigo-50 text-indigo-700 hover:border-indigo-300",
      iconBg: "bg-indigo-100 text-indigo-700",
    },
    {
      title: "AgroAI Assistant",
      description: "Ask farming questions in Kannada, Hindi, or English",
      link: "/ai-assistant",
      icon: Bot,
      color: "bg-forest-50 text-forest-700 hover:border-forest-300",
      iconBg: "bg-forest-100 text-forest-700",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900">Advisory Quick Actions</h3>
        <span className="text-xs text-slate-500">Select any tool to start</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <Link
              key={act.title}
              to={act.link}
              className={`p-4 rounded-2xl border border-slate-200/80 bg-white hover:shadow-md transition-all duration-200 flex flex-col justify-between group ${act.color}`}
            >
              <div className="space-y-2 mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${act.iconBg}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-forest-700 transition-colors">
                  {act.title}
                </h4>
                <p className="text-xs text-slate-500 line-clamp-2">
                  {act.description}
                </p>
              </div>

              <div className="flex items-center justify-end text-xs font-semibold text-forest-700 group-hover:translate-x-1 transition-transform">
                <span>Open</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

