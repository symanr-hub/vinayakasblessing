import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/common/Button";
import {
  Sprout,
  FlaskConical,
  Wheat,
  Droplets,
  Bug,
  CalendarDays,
  Bot,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  MapPin,
  Globe,
} from "lucide-react";

export const LandingPage = () => {
  const { user, t } = useAuth();

  const features = [
    {
      title: "Intelligent Crop Selection",
      description: "Match your specific soil type, pH, seasonal climate, and water availability with optimal high-yielding crops.",
      icon: Sprout,
      color: "bg-emerald-100 text-emerald-800",
      link: "/crop-recommendation",
    },
    {
      title: "Soil Fertility & Health Diagnostic",
      description: "Analyze soil test parameters (pH, N, P, K, Organic Carbon) to identify hidden nutrient deficiencies.",
      icon: FlaskConical,
      color: "bg-amber-100 text-amber-800",
      link: "/soil-analysis",
    },
    {
      title: "Crop-Stage Fertilizer Guidance",
      description: "Balanced nutrition planning tailored to crop growth stages, with organic and biofertilizer emphasis.",
      icon: Wheat,
      color: "bg-yellow-100 text-yellow-800",
      link: "/fertilizer-advisory",
    },
    {
      title: "Precision Irrigation Schedules",
      description: "Conserve water and avoid root stress with timing guidance tuned to rainfall, soil texture, and plant growth.",
      icon: Droplets,
      color: "bg-sky-100 text-sky-800",
      link: "/irrigation-advisory",
    },
    {
      title: "Visual Pest & Disease Detection",
      description: "Upload leaf or stem photos or describe symptoms to identify diseases with Integrated Pest Management (IPM).",
      icon: Bug,
      color: "bg-rose-100 text-rose-800",
      link: "/disease-detection",
    },
    {
      title: "Chronological Cultivation Calendars",
      description: "Generate and track step-by-step milestones from land plowing and seed treatment to harvesting and storage.",
      icon: CalendarDays,
      color: "bg-indigo-100 text-indigo-800",
      link: "/cultivation-calendar",
    },
  ];

  const steps = [
    {
      step: "01",
      title: "Enter Land & Farm Details",
      description: "Specify your state, district, soil type, available irrigation, and seasonal planting schedule.",
    },
    {
      step: "02",
      title: "Google Gemini AI Synthesis",
      description: "Our server analyzes agricultural packages of practices and regional climate requirements.",
    },
    {
      step: "03",
      title: "Get Practical Advisory",
      description: "Receive actionable recommendations with risk disclosures, safety warnings, and next steps.",
    },
    {
      step: "04",
      title: "Track Cultivation & Follow-Up",
      description: "Mark tasks completed and ask follow-up questions in Kannada, Hindi, Telugu, or English.",
    },
  ];

  const benefits = [
    "Prevent unnecessary expenditure on excessive chemical fertilizers and pesticides",
    "Tailored recommendations for Kharif, Rabi, and Zaid cultivation windows",
    "Complete data isolation and Row Level Security for every farmer profile",
    "Multilingual interface and AI answers supporting Indian regional languages",
    "Responsible AI safeguards: uncertainty disclosures and expert KVK escalation",
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-16 bg-gradient-to-b from-forest-50/70 via-white to-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-forest-100/80 border border-forest-200 text-forest-800 text-xs font-semibold mb-6 animate-in fade-in zoom-in duration-300">
            <Sparkles className="w-3.5 h-3.5 text-forest-600" />
            <span>AI-Powered Agriculture Decision Support</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
            {t.heroHeading}
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {t.heroDescription}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to={user ? "/dashboard" : "/register"}>
              <Button variant="primary" size="xl" icon={ArrowRight} className="w-full sm:w-auto shadow-md">
                {user ? "Go to Dashboard" : t.getStarted}
              </Button>
            </Link>
            <a href="#features">
              <Button variant="outline" size="xl" className="w-full sm:w-auto">
                {t.exploreFeatures}
              </Button>
            </a>
          </div>

          {/* Key Metric Highlights */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-2xl font-black text-forest-700 block">7+</span>
              <span className="text-xs font-semibold text-slate-500">Indian Languages Supported</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-2xl font-black text-amber-600 block">100%</span>
              <span className="text-xs font-semibold text-slate-500">Row Level Security Isolating Farmer Data</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-2xl font-black text-sky-600 block">6 Core</span>
              <span className="text-xs font-semibold text-slate-500">Specialized Advisory Engines</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-2xl font-black text-indigo-600 block">Gemini</span>
              <span className="text-xs font-semibold text-slate-500">Structured AI Agricultural Intelligence</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-forest-600">
            Step-by-Step Flow
          </span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
            How AgroAI Works for Farmers
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            From entering your soil test to receiving stage-by-stage guidance, precision farming is streamlined.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {steps.map((s, idx) => (
            <div
              key={s.step}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-forest-300 transition-colors relative"
            >
              <div className="text-3xl font-black text-forest-100 mb-4">{s.step}</div>
              <h3 className="text-base font-bold text-slate-900 mb-2">{s.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. MAIN FEATURE CARDS */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-forest-600">
            Comprehensive Platform
          </span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
            End-to-End Precision Agricultural Intelligence
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Every critical agricultural decision is backed by intelligent data processing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${feat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{feat.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-100">
                  <Link
                    to={feat.link}
                    className="text-xs font-bold text-forest-700 hover:text-forest-900 flex items-center gap-1.5 group"
                  >
                    <span>Launch Module</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. FARMER BENEFITS & SAFETY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-forest-900 rounded-3xl text-white p-8 sm:p-12 shadow-xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-forest-800 text-forest-200 inline-block">
              Built for Sustainable Agriculture
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Designed for Higher Yields & Lower Farm Expenditure
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Farming requires navigating uncertain weather, fluctuating soil health, and pest attacks. AgroAI bridges the gap between scientific agricultural research and daily on-field decisions.
            </p>

            <ul className="space-y-3 pt-2">
              {benefits.map((b, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-harvest-400 shrink-0 mt-0.5" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 space-y-4">
            <div className="flex items-center gap-2.5 text-harvest-400 font-bold text-sm">
              <ShieldCheck className="w-5 h-5 shrink-0" />
              <span>Responsible AI Agricultural Architecture</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Unlike generic chatbots, AgroAI runs through dedicated Zod-validated schemas and strict safety guidelines:
            </p>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-black/20">
                <b>No Fabricated Observations:</b> Missing lab tests are marked as unknown rather than guessed.
              </div>
              <div className="p-3 rounded-xl bg-black/20">
                <b>Integrated Pest Management (IPM):</b> Prioritizes biological traps and cultural sanitation over hazardous sprays.
              </div>
              <div className="p-3 rounded-xl bg-black/20">
                <b>Regional Indian Crop Support:</b> Tuned for Kharif, Rabi, and Zaid seasons across Indian agro-climatic zones.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-6">
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Ready to Elevate Your Farm's Productivity?
        </h2>
        <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
          Create your free farmer account to analyze your soil, receive crop recommendations, and generate season calendars.
        </p>
        <div className="flex justify-center gap-4 pt-2">
          <Link to="/register">
            <Button variant="primary" size="lg" icon={ArrowRight}>
              Create Farmer Account
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" size="lg">
              Sign In
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

