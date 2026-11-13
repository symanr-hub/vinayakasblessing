import React, { useState } from "react";
import { api } from "../services/api";
import { Input } from "../components/common/Input";
import { Select } from "../components/common/Select";
import { Button } from "../components/common/Button";
import { FertilizerAdvisoryCard } from "../components/agriculture/FertilizerAdvisoryCard";
import { useAuth } from "../context/AuthContext";
import { Wheat, Sparkles, RefreshCw, AlertCircle } from "lucide-react";

export const FertilizerPage = () => {
  const { language, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [advisory, setAdvisory] = useState(null);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    cropName: "Paddy / Rice",
    cropVariety: "",
    growthStage: "Vegetative / Tillering",
    landArea: profile?.land_area ? Number(profile.land_area) : 2.0,
    landUnit: profile?.land_unit || "acre",
    soilPH: "",
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    organicCarbon: "",
    existingFertilizer: "Applied Farm Yard Manure (FYM) during land preparation",
    farmingMethod: "Conventional",
    language: language || "en",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.cropName.trim() || !formData.growthStage.trim()) return;

    try {
      setLoading(true);
      setError(null);

      const payload = {
        ...formData,
        landArea: Number(formData.landArea),
        soilPH: formData.soilPH !== "" ? Number(formData.soilPH) : null,
        nitrogen: formData.nitrogen !== "" ? Number(formData.nitrogen) : null,
        phosphorus: formData.phosphorus !== "" ? Number(formData.phosphorus) : null,
        potassium: formData.potassium !== "" ? Number(formData.potassium) : null,
        organicCarbon: formData.organicCarbon !== "" ? Number(formData.organicCarbon) : null,
      };

      const res = await api.recommendFertilizer(payload);
      setAdvisory(res.data);
    } catch (err) {
      console.error("Fertilizer advisory error:", err);
      setError(err.message || "Failed to generate fertilizer guidance.");
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
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-yellow-100 text-yellow-800">
              Crop Nutrition Engine
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Fertilizer & Nutrient Advisory
          </h2>
          <p className="text-xs text-slate-500">
            Stage-specific macronutrient, micronutrient, and organic fertilizer schedules designed to avoid over-expenditure and chemical toxicity.
          </p>
        </div>

        {advisory && (
          <Button variant="outline" size="sm" icon={RefreshCw} onClick={handleReset}>
            New Fertilizer Check
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
              placeholder="e.g. Cotton, Wheat, Sugarcane"
              required
            />

            <Input
              label="Crop Variety (Optional)"
              name="cropVariety"
              value={formData.cropVariety}
              onChange={handleChange}
              placeholder="e.g. BT Cotton, Co-86032"
            />

            <Select
              label="Current Growth Stage"
              name="growthStage"
              value={formData.growthStage}
              onChange={handleChange}
              options={[
                "Basal / Sowing",
                "Germination / Seedling",
                "Vegetative / Tillering",
                "Panicle Initiation / Branching",
                "Flowering / Heading",
                "Grain Filling / Pod Development",
                "Maturity / Ripening",
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
              label="Farming Practice"
              name="farmingMethod"
              value={formData.farmingMethod}
              onChange={handleChange}
              options={["Conventional", "Organic", "Integrated", "Natural"]}
            />

            <Input
              label="Existing Fertilizers Applied"
              name="existingFertilizer"
              value={formData.existingFertilizer}
              onChange={handleChange}
              placeholder="e.g. 50kg DAP, 2 tons FYM"
            />
          </div>

          {/* Optional Soil Nutrients */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-1 border-b border-slate-100">
              Soil Test Values if Known (Optional for Calibration)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Input
                label="Soil pH"
                name="soilPH"
                type="number"
                step="0.1"
                value={formData.soilPH}
                onChange={handleChange}
                placeholder="e.g. 6.8"
              />
              <Input
                label="Available N (kg/ha)"
                name="nitrogen"
                type="number"
                value={formData.nitrogen}
                onChange={handleChange}
                placeholder="e.g. 250"
              />
              <Input
                label="Available P (kg/ha)"
                name="phosphorus"
                type="number"
                value={formData.phosphorus}
                onChange={handleChange}
                placeholder="e.g. 30"
              />
              <Input
                label="Available K (kg/ha)"
                name="potassium"
                type="number"
                value={formData.potassium}
                onChange={handleChange}
                placeholder="e.g. 200"
              />
            </div>
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
              {loading ? "Calculating Nutrition Needs..." : "Generate Fertilizer Advisory"}
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-6 animate-in fade-in duration-300">
          <FertilizerAdvisoryCard advisory={advisory} />
        </div>
      )}
    </div>
  );
};

