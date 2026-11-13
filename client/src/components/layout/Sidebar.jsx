import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  Sprout,
  FlaskConical,
  Wheat,
  Droplets,
  Bug,
  CalendarDays,
  Bot,
  History,
  MapPin,
  User,
  Settings,
} from "lucide-react";

export const Sidebar = ({ onClose }) => {
  const { t } = useAuth();

  const navItems = [
    { name: t.navDashboard, path: "/dashboard", icon: LayoutDashboard },
    { name: t.navFarms, path: "/farms", icon: MapPin },
    { name: t.navCropRec, path: "/crop-recommendation", icon: Sprout },
    { name: t.navSoil, path: "/soil-analysis", icon: FlaskConical },
    { name: t.navFertilizer, path: "/fertilizer-advisory", icon: Wheat },
    { name: t.navIrrigation, path: "/irrigation-advisory", icon: Droplets },
    { name: t.navDisease, path: "/disease-detection", icon: Bug },
    { name: t.navCalendar, path: "/cultivation-calendar", icon: CalendarDays },
    { name: t.navAssistant, path: "/ai-assistant", icon: Bot },
    { name: t.navHistory, path: "/history", icon: History },
  ];

  const bottomItems = [
    { name: t.navProfile, path: "/profile", icon: User },
    { name: t.navSettings, path: "/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between h-full select-none">
      <div className="p-4 space-y-6">
        {/* Brand in Sidebar */}
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-xl bg-forest-600 flex items-center justify-center text-white shadow-sm">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black tracking-tight text-forest-950">
              Agro<span className="text-harvest-500">AI</span>
            </h2>
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
              Precision Farming
            </p>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="space-y-1">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Advisory Modules
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? "bg-forest-600 text-white shadow-sm shadow-forest-600/20"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile & Settings */}
      <div className="p-4 border-t border-slate-100 space-y-1">
        <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
          Preferences
        </p>
        {bottomItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  isActive
                    ? "bg-slate-100 text-forest-800 font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0 text-slate-400" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </div>
    </aside>
  );
};

