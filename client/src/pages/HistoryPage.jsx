import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { SearchFilter } from "../components/history/SearchFilter";
import { AdvisoryHistoryCard } from "../components/history/AdvisoryHistoryCard";
import { EmptyState } from "../components/common/EmptyState";
import { LoadingScreen } from "../components/common/LoadingScreen";
import { ConfirmationDialog } from "../components/common/ConfirmationDialog";
import { History, Trash2, ArrowLeft } from "lucide-react";

export const HistoryPage = () => {
  const [advisories, setAdvisories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadAllHistory = async () => {
    try {
      setLoading(true);

      const [cropRes, soilRes, fertRes, irrigRes, diseaseRes, calRes] = await Promise.all([
        api.getCropRecommendations({ limit: 50 }),
        api.getSoilReports({ limit: 50 }),
        api.getFertilizerAdvisories({ limit: 50 }),
        api.getIrrigationAdvisories({ limit: 50 }),
        api.getDiseaseReports({ limit: 50 }),
        api.getCalendars({ limit: 50 }),
      ]);

      const items = [
        ...(cropRes.data?.recommendations || []).map((c) => ({
          id: c.id,
          type: "crop",
          title: `Crop Advisory: ${c.input_data?.season} Season`,
          summary: `${c.recommendations?.summary || ""} (Recommended: ${(c.recommendations?.recommendations || []).map(r => r.cropName).join(", ")})`,
          detailsCount: `${(c.recommendations?.recommendations || []).length} Crops Evaluated`,
          created_at: c.created_at,
        })),
        ...(soilRes.data?.reports || []).map((s) => ({
          id: s.id,
          type: "soil",
          title: `Soil Health: ${s.soil_data?.soilType}`,
          summary: s.analysis?.overallAssessment || "Soil test evaluation",
          detailsCount: `pH ${s.soil_data?.soilPH || "N/A"}`,
          created_at: s.created_at,
        })),
        ...(fertRes.data?.advisories || []).map((f) => ({
          id: f.id,
          type: "fertilizer",
          title: `Fertilizer Guidance: ${f.crop_name}`,
          summary: `Stage: ${f.input_data?.growthStage || "Growth stage"} - ${(f.advisory?.recommendations || []).map(r => r.fertilizerCategory).join(", ")}`,
          detailsCount: `${(f.advisory?.recommendations || []).length} Fertilizer Steps`,
          created_at: f.created_at,
        })),
        ...(irrigRes.data?.advisories || []).map((i) => ({
          id: i.id,
          type: "irrigation",
          title: `Irrigation Schedule: ${i.crop_name}`,
          summary: `${i.advisory?.waterRequirement || ""} water requirement. Method: ${i.input_data?.irrigationMethod}`,
          detailsCount: `${(i.advisory?.irrigationRecommendations || []).length} Delivery Timings`,
          created_at: i.created_at,
        })),
        ...(diseaseRes.data?.reports || []).map((d) => ({
          id: d.id,
          type: "disease",
          title: `Disease Check: ${d.crop_name}`,
          summary: `Identified: ${(d.analysis?.possibleConditions || []).map(c => c.name).join(", ")}`,
          detailsCount: `${(d.analysis?.possibleConditions || []).length} Conditions Detected`,
          created_at: d.created_at,
        })),
        ...(calRes.data?.calendars || []).map((cl) => ({
          id: cl.id,
          type: "calendar",
          title: `Cultivation Schedule: ${cl.crop_name}`,
          summary: `Timeline starting ${cl.start_date}. Covers ${cl.activities?.activities?.length || 0} production stages.`,
          detailsCount: `${(cl.activities?.activities || []).length} Milestones`,
          created_at: cl.created_at,
        })),
      ];

      // Sort by newest first
      items.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setAdvisories(items);
    } catch (err) {
      console.error("Error loading advisory history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllHistory();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      switch (deleteTarget.type) {
        case "crop":
          await api.deleteCropRecommendation(deleteTarget.id);
          break;
        case "soil":
          await api.deleteSoilReport(deleteTarget.id);
          break;
        case "fertilizer":
          await api.deleteFertilizerAdvisory(deleteTarget.id);
          break;
        case "irrigation":
          await api.deleteIrrigationAdvisory(deleteTarget.id);
          break;
        case "disease":
          await api.deleteDiseaseReport(deleteTarget.id);
          break;
        case "calendar":
          await api.deleteCalendar(deleteTarget.id);
          break;
        default:
          break;
      }

      setAdvisories((prev) => prev.filter((item) => item.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      console.error("Delete error:", err);
      alert(err.message || "Failed to delete advisory report.");
    } finally {
      setDeleting(false);
    }
  };

  // Filter & Search logic
  const filtered = advisories.filter((item) => {
    const matchesType = selectedType === "all" || item.type === selectedType;
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      !query ||
      item.title.toLowerCase().includes(query) ||
      item.summary?.toLowerCase().includes(query) ||
      item.type.toLowerCase().includes(query);

    return matchesType && matchesSearch;
  });

  if (loading) {
    return <LoadingScreen message="Loading complete advisory history..." />;
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-800">
              Audit Trail & Records
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Advisory History & Farming Archive
          </h2>
          <p className="text-xs text-slate-500">
            Search, filter, inspect, or manage all previously generated agricultural reports.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
      />

      {/* Results Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={History}
          title="No advisory records found"
          description={
            searchTerm || selectedType !== "all"
              ? "No records match your search criteria. Try adjusting filters."
              : "Generate crop, soil, fertilizer, or disease advisories to build your agricultural archive."
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item) => (
            <AdvisoryHistoryCard
              key={`${item.type}-${item.id}`}
              item={item}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Advisory Record?"
        message={`Are you sure you want to permanently delete this ${deleteTarget?.type} advisory record? This action cannot be reversed.`}
        loading={deleting}
      />
    </div>
  );
};

