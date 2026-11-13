import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { Menu, X } from "lucide-react";

export const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Universal Navbar */}
      <Navbar />

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Fixed Sidebar */}
        <div className="hidden lg:block shrink-0 h-[calc(100vh-4rem)] sticky top-16">
          <Sidebar />
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="relative w-64 bg-white h-full z-10 shadow-xl">
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
              <Sidebar onClose={() => setSidebarOpen(false)} />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {/* Mobile Sidebar Toggle Button */}
          <div className="lg:hidden mb-4 flex items-center justify-between pb-3 border-b border-slate-200">
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex items-center gap-2 text-xs font-semibold px-3 py-2 bg-white rounded-xl border border-slate-200 text-slate-700 shadow-sm"
            >
              <Menu className="w-4 h-4 text-forest-600" />
              <span>Advisory Modules Menu</span>
            </button>
          </div>

          <Outlet />
        </main>
      </div>
    </div>
  );
};

