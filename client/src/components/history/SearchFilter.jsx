import React from "react";
import { Search, Filter } from "lucide-react";

export const SearchFilter = ({
  searchTerm,
  onSearchChange,
  selectedType,
  onTypeChange,
}) => {
  const typeOptions = [
    { value: "all", label: "All Advisories" },
    { value: "crop", label: "Crop Recommendations" },
    { value: "soil", label: "Soil Health Reports" },
    { value: "fertilizer", label: "Fertilizer Advisories" },
    { value: "irrigation", label: "Irrigation Schedules" },
    { value: "disease", label: "Disease & Pest Reports" },
    { value: "calendar", label: "Cultivation Calendars" },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
      {/* Search Input */}
      <div className="relative flex-1 w-full">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by crop, soil type, or symptoms..."
          className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-forest-500/20 focus:border-forest-600 focus:bg-white transition-colors"
        />
      </div>

      {/* Type Filter Dropdown */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
        <select
          value={selectedType}
          onChange={(e) => onTypeChange(e.target.value)}
          className="w-full sm:w-56 text-xs sm:text-sm border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 text-slate-800 focus:outline-none focus:border-forest-600 cursor-pointer"
        >
          {typeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

