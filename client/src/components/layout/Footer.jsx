import React from "react";
import { Link } from "react-router-dom";
import { Sprout, ShieldAlert, Heart } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export const Footer = () => {
  const { t } = useAuth();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand & Mission */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-forest-600 flex items-center justify-center text-white">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                Agro<span className="text-harvest-400">AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering farmers with artificial intelligence for crop suitability, soil health management, balanced nutrition, pest diagnostics, and precision irrigation.
            </p>
          </div>

          {/* Core Modules */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Agricultural Modules
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/crop-recommendation" className="hover:text-forest-400 transition-colors">
                  Crop Recommendation
                </Link>
              </li>
              <li>
                <Link to="/soil-analysis" className="hover:text-forest-400 transition-colors">
                  Soil Health Analysis
                </Link>
              </li>
              <li>
                <Link to="/fertilizer-advisory" className="hover:text-forest-400 transition-colors">
                  Fertilizer Management
                </Link>
              </li>
              <li>
                <Link to="/irrigation-advisory" className="hover:text-forest-400 transition-colors">
                  Irrigation Scheduling
                </Link>
              </li>
              <li>
                <Link to="/disease-detection" className="hover:text-forest-400 transition-colors">
                  Disease & Pest Detection
                </Link>
              </li>
            </ul>
          </div>

          {/* Agricultural Resources */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Farming Resources
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/cultivation-calendar" className="hover:text-forest-400 transition-colors">
                  Cultivation Timelines
                </Link>
              </li>
              <li>
                <Link to="/ai-assistant" className="hover:text-forest-400 transition-colors">
                  Multilingual AI Assistant
                </Link>
              </li>
              <li>
                <span className="text-slate-500">ICAR & KVK Extension Guidelines</span>
              </li>
              <li>
                <span className="text-slate-500">Integrated Pest Management (IPM)</span>
              </li>
              <li>
                <span className="text-slate-500">Soil Health Card Scheme</span>
              </li>
            </ul>
          </div>

          {/* Responsible Advisory Disclaimer */}
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>Scientific Disclaimer</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              AgroAI provides decision support estimates. Predictions must never be treated as guaranteed scientific facts. Please consult certified local agricultural extension officers or Krishi Vigyan Kendras before significant financial or chemical commitments.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} AgroAI Assistant. Built for Indian & Global Agricultural Communities.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Powered by Google Gemini</span>
            <span>•</span>
            <span>Supabase PostgreSQL</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

