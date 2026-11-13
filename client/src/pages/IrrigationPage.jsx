import React, { useState } from "react";
import { api } from "../services/api";
import { Input } from "../components/common/Input";
import { Select } from "../components/common/Select";
import { Button } from "../components/common/Button";
import { IrrigationAdvisoryCard } from "../components/agriculture/IrrigationAdvisoryCard";
import { useAuth } from "../context/AuthContext";
import { Droplets, Sparkles, RefreshCw, AlertCircle } from "lucide-react";

export const IrrigationPage = () => {
  const { language, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [advisory, setAdvisory] = useState(null);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    cropName: "Tomato",
    growthStage: "Flowering & Fruit Setting",
    soilType: "Loamy soil",
    landArea: profile?.land_area ? Number(profile.land_area) : 1.5,
    landUnit: profile?.land_unit || "acre",
    irrigationMethod: "Drip irrigation",
    waterAvailability: "Moderate",
    lastRainfall: "3 days ago (light shower)",
    temperature: "31",
    humidity: "65",
    language: language || "en",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.cropName.trim()) return;

    try {
      setLoading(true);
      setError(null);

      const payload = {
        ...formData,
        landArea: Number(formData.landArea),
        temperature: formData.temperature !== "" ? Number(formData.temperature) : null,
        humidity: formData.humidity !== "" ? Number(formData.humidity) : null,
      };

      const res = await api.recommendIrrigation(payload);
      setAdvisory(res.data);
    } catch (err) {
      console.error("Irrigation advisory error:", err);
      setError(err.message || "Failed to generate irrigation guidance.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setAdvisory(null);
    setError(null);
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800">
              Water Management Engine
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Irrigation & Water Scheduling
          </h2>
          <p className="text-xs text-slate-500">
            Determine critical water stress periods, optimal delivery timing, water conservation methods, and drainage guidance.
          </p>
        </div>

        {advisory && (
          <Button variant="outline" size="sm" icon={RefreshCw} onClick={handleReset}>
            New Irrigation Check
          </Button>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold">Advisory Generation Failed</h4>
            <p className="mt-0.5 leading-relaxed">{error}</p>
          </div>
        </div>
      )}

      {!advisory ? (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Crop Name"
              name="cropName"
              value={formData.cropName}
              onChange={handleChange}
              placeholder="e.g. Maize, Banana, Paddy"
              required
            />

            <Select
              label="Growth Stage"
              name="growthStage"
              value={formData.growthStage}
              onChange={handleChange}
              options={[
                "Germination / Establishment",
                "Vegetative growth",
                "Flowering & Fruit Setting",
                "Fruit / Grain development",
                "Maturity & Pre-harvest",
              ]}
              required
            />

            <Select
              label="Soil Type"
              name="soilType"
              value={formData.soilType}
              onChange={handleChange}
              options={[
                "Loamy soil",
                "Clay soil",
                "Sandy soil",
                "Black soil (Regur)",
                "Red soil",
                "Alluvial soil",
              ]}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex gap-2">
              <Input
                label="Land Area"
                name="landArea"
                type="number"
                step="0.1"
                min="0.1"
                value={formData.landArea}
                onChange={handleChange}
                required
              />
              <div className="w-32">
                <Select
                  label="Unit"
                  name="landUnit"
                  value={formData.landUnit}
                  onChange={handleChange}
                  options={["acre", "hectare", "sqm", "bigha", "guntha"]}
                />
              </div>
            </div>

            <Select
              label="Current Irrigation Method"
              name="irrigationMethod"
              value={formData.irrigationMethod}
              onChange={handleChange}
              options={[
                "Drip irrigation",
                "Sprinkler irrigation",
                "Surface furrow",
                "Basin / Flood irrigation",
                "Rain-fed only",
              ]}
              required
            />

            <Select
              label="Water Availability"
              name="waterAvailability"
              value={formData.waterAvailability}
              onChange={handleChange}
              options={["Abundant", "Moderate", "Scarce", "Rain-fed Only"]}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Last Rainfall Observation"
              name="lastRainfall"
              value={formData.lastRainfall}
              onChange={handleChange}
              placeholder="e.g. 2 days ago, Dry past 2 weeks"
            />

            <Input
              label="Ambient Temperature (°C)"
              name="temperature"
              type="number"
              value={formData.temperature}
              onChange={handleChange}
              placeholder="e.g. 32"
            />

            <Input
              label="Relative Humidity (%)"
              name="humidity"
              type="number"
              min="0"
              max="100"
              value={formData.humidity}
              onChange={handleChange}
              placeholder="e.g. 60"
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              icon={Sparkles}
              className="w-full sm:w-auto"
            >
              {loading ? "Calculating Crop Water Needs..." : "Generate Irrigation Advisory"}
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-6 animate-in fade-in duration-300">
          <IrrigationAdvisoryCard advisory={advisory} />
        </div>
      )}
    </div>
  );
};

