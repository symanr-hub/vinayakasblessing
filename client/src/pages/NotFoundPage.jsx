import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/common/Button";
import { Sprout, Home, LayoutDashboard } from "lucide-react";

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-5">
      <div className="w-16 h-16 rounded-3xl bg-forest-100 text-forest-700 flex items-center justify-center shadow-xs">
        <Sprout className="w-8 h-8" />
      </div>

      <div className="space-y-2 max-w-md">
        <h1 className="text-5xl font-black text-slate-900 tracking-tight">404</h1>
        <h2 className="text-xl font-bold text-slate-800">
          Field Not Found
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          The agricultural page or advisory report you are searching for does not exist or may have been relocated.
        </p>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Link to="/">
          <Button variant="outline" size="md" icon={Home}>
            Home
          </Button>
        </Link>
        <Link to="/dashboard">
          <Button variant="primary" size="md" icon={LayoutDashboard}>
            Farmer Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

