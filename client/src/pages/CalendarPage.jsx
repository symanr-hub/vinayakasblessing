import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { CultivationTimeline } from "../components/agriculture/CultivationTimeline";
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";
import { Select } from "../components/common/Select";
import { LoadingScreen } from "../components/common/LoadingScreen";
import { EmptyState } from "../components/common/EmptyState";
import { ConfirmationDialog } from "../components/common/ConfirmationDialog";
import { useAuth } from "../context/AuthContext";
import { CalendarDays, Plus, Trash2, Sparkles, AlertCircle } from "lucide-react";

export const CalendarPage = () => {
  const { language, profile } = useAuth();
  const [calendars, setCalendars] = useState([]);
  const [activeCalendar, setActiveCalendar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [savingActivities, setSavingActivities] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showGenerator, setShowGenerator] = useState(false);
  const [error, setError] = useState(null);

  const todayStr = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    cropName: "Paddy / Rice",
    startDate: todayStr,
    state: profile?.state || "Karnataka",
    district: profile?.district || "",
    soilType: "Loamy soil",
    irrigationAvailable: profile?.irrigation_available ?? true,
    farmingType: profile?.farming_type || "Conventional",
    language: language || "en",
  });

  const loadCalendars = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getCalendars();
      const list = res.data?.calendars || [];
      setCalendars(list);
      if (list.length > 0 && !activeCalendar) {
        setActiveCalendar(list[0]);
      }
    } catch (err) {
      console.error("Error loading calendars:", err);
      setError(err.message || "Failed to load cultivation calendars.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCalendars();
  }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!formData.cropName.trim()) return;

    try {
      setGenerating(true);
      setError(null);
      const res = await api.generateCalendar(formData);
      const newCal = res.data;
      setCalendars([newCal, ...calendars]);
      setActiveCalendar(newCal);
      setShowGenerator(false);
    } catch (err) {
      console.error("Calendar generation error:", err);
      setError(err.message || "Failed to generate cultivation calendar.");
    } finally {
      setGenerating(false);
    }
  };

  const handleToggleActivity = async (updatedActivities) => {
    if (!activeCalendar) return;
    try {
      setSavingActivities(true);
      const res = await api.updateCalendarActivities(activeCalendar.id, updatedActivities);
      const updatedCal = res.data;
      setActiveCalendar(updatedCal);
      setCalendars(calendars.map((c) => (c.id === updatedCal.id ? updatedCal : c)));
    } catch (err) {
      console.error("Failed to update milestone:", err);
    } finally {
      setSavingActivities(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.deleteCalendar(deleteTarget.id);
      const remaining = calendars.filter((c) => c.id !== deleteTarget.id);
      setCalendars(remaining);
      if (activeCalendar?.id === deleteTarget.id) {
        setActiveCalendar(remaining[0] || null);
      }
      setDeleteTarget(null);
    } catch (err) {
      console.error("Error deleting calendar:", err);
      alert(err.message || "Failed to delete cultivation calendar");
    }
  };

  if (loading) {
    return <LoadingScreen message="Loading cultivation schedules..." />;
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
              Crop Schedule Engine
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Cultivation Calendar & Timeline
          </h2>
          <p className="text-xs text-slate-500">
            Generate and monitor chronologically scheduled milestones from land prep and sowing through harvest.
          </p>
        </div>

        <Button
          variant={showGenerator ? "outline" : "primary"}
          size="md"
          icon={Plus}
          onClick={() => setShowGenerator(!showGenerator)}
        >
          {showGenerator ? "Close Generator" : "Generate New Cultivation Calendar"}
        </Button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold">Error</h4>
            <p className="mt-0.5 leading-relaxed">{error}</p>
          </div>
        </div>
      )}

      {/* Generator Form */}
      {showGenerator && (
        <form onSubmit={handleGenerate} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">
              Configure Crop Sowing Schedule
            </h3>
            <span className="text-xs text-slate-500">Chronological timeline planning</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Crop Name"
              name="cropName"
              value={formData.cropName}
              onChange={(e) => setFormData({ ...formData, cropName: e.target.value })}
              placeholder="e.g. Groundnut, Maize, Wheat"
              required
            />

            <Input
              label="Planned Sowing Date"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              required
            />

            <Select
              label="Farming Practice"
              name="farmingType"
              value={formData.farmingType}
              onChange={(e) => setFormData({ ...formData, farmingType: e.target.value })}
              options={["Conventional", "Organic", "Natural Farming", "Integrated"]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="State"
              name="state"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              placeholder="e.g. Karnataka"
            />

            <Input
              label="District"
              name="district"
              value={formData.district}
              onChange={(e) => setFormData({ ...formData, district: e.target.value })}
              placeholder="e.g. Mandya"
            />

            <Select
              label="Soil Type"
              name="soilType"
              value={formData.soilType}
              onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
              options={[
                "Loamy soil",
                "Clay soil",
                "Sandy soil",
                "Black soil (Regur)",
                "Red soil",
                "Alluvial soil",
              ]}
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={generating}
              icon={Sparkles}
            >
              {generating ? "Building Schedule..." : "Generate AI Cultivation Timeline"}
            </Button>
          </div>
        </form>
      )}

      {/* Existing Calendars or Empty State */}
      {calendars.length === 0 && !showGenerator ? (
        <EmptyState
          icon={CalendarDays}
          title="No cultivation calendars generated"
          description="Create your first crop production schedule to track activities from sowing to harvest."
          actionLabel="Generate Cultivation Calendar"
          onAction={() => setShowGenerator(true)}
        />
      ) : (
        <div className="space-y-6">
          {/* Calendar Selector Tabs */}
          {calendars.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {calendars.map((cal) => (
                <div
                  key={cal.id}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer shrink-0 ${
                    activeCalendar?.id === cal.id
                      ? "bg-forest-600 text-white border-forest-600 shadow-xs"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                  onClick={() => setActiveCalendar(cal)}
                >
                  <span>{cal.crop_name}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteTarget(cal);
                    }}
                    className={`p-1 rounded-md hover:bg-black/10 transition-colors ${
                      activeCalendar?.id === cal.id ? "text-white/80" : "text-slate-400"
                    }`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeCalendar && (
            <CultivationTimeline
              calendar={activeCalendar}
              onToggleActivity={handleToggleActivity}
              saving={savingActivities}
            />
          )}
        </div>
      )}

      <ConfirmationDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Cultivation Schedule?"
        message={`Are you sure you want to delete the schedule for ${deleteTarget?.crop_name}? This cannot be undone.`}
      />
    </div>
  );
};

