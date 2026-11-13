import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Sprout, MapPin, Award, ArrowRight } from "lucide-react";

export const WelcomeCard = ({ profile, completion = 30 }) => {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const farmerName = profile?.full_name || user?.user_metadata?.full_name || "Farmer";
  const locationText = [profile?.district, profile?.state].filter(Boolean).join(", ") || "Location not set";

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-forest-800 via-forest-900 to-slate-900 text-white p-6 sm:p-8 shadow-md">
      {/* Decorative leaf watermarks */}
      <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-forest-600/10 pointer-events-none" />
      <div className="absolute right-16 -top-12 w-32 h-32 rounded-full bg-harvest-400/10 pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-forest-700/80 text-forest-200">
              {getGreeting()}
            </span>
            <div className="flex items-center gap-1 text-xs text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-harvest-400" />
              <span>{locationText}</span>
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Namaste, {farmerName}!
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Welcome to your intelligent agricultural workspace. Access personalized crop advisories, soil diagnostic tools, water scheduling, and expert farming guidance.
          </p>

          {profile?.farming_experience > 0 && (
            <div className="flex items-center gap-3 pt-1 text-xs text-slate-300">
              <span>🌾 Experience: <b>{profile.farming_experience} Years</b></span>
              <span>•</span>
              <span>🚜 Land: <b>{profile.land_area || 0} {profile.land_unit || 'Acres'}</b></span>
              <span>•</span>
              <span>🌱 Method: <b>{profile.farming_type || 'Conventional'}</b></span>
            </div>
          )}
        </div>

        {/* Profile Completion Badge */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 min-w-[200px] shrink-0">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-slate-200 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-harvest-400" />
              Profile Status
            </span>
            <span className="font-bold text-harvest-400">{completion}%</span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-700/50 rounded-full h-2 mb-3 overflow-hidden">
            <div
              className="bg-harvest-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${completion}%` }}
            />
          </div>

          <Link
            to="/profile"
            className="text-xs font-semibold text-white hover:text-harvest-300 flex items-center justify-between group"
          >
            <span>{completion === 100 ? "View Profile" : "Complete Profile"}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

