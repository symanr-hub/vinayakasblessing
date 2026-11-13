import React, { useState, useEffect } from "react";
import { Input } from "../common/Input";
import { Select } from "../common/Select";
import { Button } from "../common/Button";
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { Sprout, MapPin, Layers, Droplets, Sparkles } from "lucide-react";

export const CropRecommendationForm = ({ onSubmit, loading = false }) => {
  const { profile, language } = useAuth();
  const [farms, setFarms] = useState([]);
  const [selectedFarmId, setSelectedFarmId] = useState("");

  const [formData, setFormData] = useState({
    state: profile?.state || "Karnataka",
    district: profile?.district || "",
    soilType: "Loamy soil",
    season: "Kharif",
    landArea: profile?.land_area ? Number(profile.land_area) : 2.5,
    landUnit: profile?.land_unit || "acre",
    irrigationAvailable: profile?.irrigation_available ?? true,
    soilPH: "",
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    organicCarbon: "",
    temperature: "",
    humidity: "",
    rainfall: "",
    preferredCategory: "",
    previousCrop: "",
    language: language || "en",
  });

  const [errors, setErrors] = useState({});

  // Fetch farmer's saved farm parcels
  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const res = await api.getFarms();
        if (res.data && res.data.length > 0) {
          setFarms(res.data);
        }
      } catch (err) {
        console.warn("Could not load farm parcels:", err.message);
      }
    };
    fetchFarms();
  }, []);

  // Update language when user changes global language
  useEffect(() => {
    setFormData((prev) => ({ ...prev, language: language || "en" }));
  }, [language]);

  // Handle farm selection
  const handleFarmSelect = (e) => {
    const farmId = e.target.value;
    setSelectedFarmId(farmId);
    if (!farmId) return;

    const farm = farms.find((f) => f.id === farmId);
    if (farm) {
      setFormData((prev) => ({
        ...prev,
        state: farm.state || prev.state,
        district: farm.district || prev.district,
        soilType: farm.soil_type || prev.soilType,
        landArea: Number(farm.land_area) || prev.landArea,
        landUnit: farm.land_unit || prev.landUnit,
        soilPH: farm.soil_ph !== null && farm.soil_ph !== undefined ? farm.soil_ph : prev.soilPH,
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.district.trim()) newErrors.district = "District is required";
    if (!formData.soilType) newErrors.soilType = "Soil type is required";
    if (!formData.landArea || Number(formData.landArea) <= 0) newErrors.landArea = "Enter a valid land area";

    if (formData.soilPH !== "" && (Number(formData.soilPH) < 0 || Number(formData.soilPH) > 14)) {
      newErrors.soilPH = "pH must be between 0 and 14";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Sanitize numeric optional fields
    const payload = {
      ...formData,
      farmId: selectedFarmId || null,
      landArea: Number(formData.landArea),
      soilPH: formData.soilPH !== "" ? Number(formData.soilPH) : null,
      nitrogen: formData.nitrogen !== "" ? Number(formData.nitrogen) : null,
      phosphorus: formData.phosphorus !== "" ? Number(formData.phosphorus) : null,
      potassium: formData.potassium !== "" ? Number(formData.potassium) : null,
      organicCarbon: formData.organicCarbon !== "" ? Number(formData.organicCarbon) : null,
      temperature: formData.temperature !== "" ? Number(formData.temperature) : null,
      humidity: formData.humidity !== "" ? Number(formData.humidity) : null,
      rainfall: formData.rainfall !== "" ? Number(formData.rainfall) : null,
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
      {/* Farm Plot Picker if any */}
      {farms.length > 0 && (
        <div className="p-3.5 bg-forest-50/70 border border-forest-200/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-forest-900">
            <MapPin className="w-4 h-4 text-forest-600" />
            <span>Load from your registered Farm Plots:</span>
          </div>
          <select
            value={selectedFarmId}
            onChange={handleFarmSelect}
            className="text-xs border border-forest-300 rounded-lg px-3 py-1.5 bg-white text-slate-800"
          >
            <option value="">-- Choose Farm Plot (Auto-fill) --</option>
            {farms.map((f) => (
              <option key={f.id} value={f.id}>
                {f.farm_name} ({f.land_area} {f.land_unit} • {f.district || f.state})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Primary Location & Season */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 pb-2 border-b border-slate-100">
          <MapPin className="w-3.5 h-3.5 text-forest-600" />
          Location & Agricultural Season
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="State"
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="e.g. Karnataka, Maharashtra"
            error={errors.state}
            required
          />

          <Input
            label="District"
            name="district"
            value={formData.district}
            onChange={handleChange}
            placeholder="e.g. Mandya, Mysuru"
            error={errors.district}
            required
          />

          <Select
            label="Cultivation Season"
            name="season"
            value={formData.season}
            onChange={handleChange}
            options={[
              { value: "Kharif", label: "Kharif (Monsoon / June-Oct)" },
              { value: "Rabi", label: "Rabi (Winter / Oct-March)" },
              { value: "Zaid", label: "Zaid (Summer / March-June)" },
              { value: "Year-round", label: "Year-round (Perennial)" },
              { value: "Other", label: "Other / Transition Season" },
            ]}
            required
          />
        </div>
      </div>

      {/* Land & Soil Characteristics */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 pb-2 border-b border-slate-100">
          <Layers className="w-3.5 h-3.5 text-amber-600" />
          Soil & Land Characteristics
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            label="Soil Type"
            name="soilType"
            value={formData.soilType}
            onChange={handleChange}
            options={[
              "Black soil (Regur)",
              "Red soil",
              "Alluvial soil",
              "Loamy soil",
              "Clay soil",
              "Sandy soil",
              "Silty soil",
              "Laterite soil",
            ]}
            error={errors.soilType}
            required
          />

          <div className="flex gap-2">
            <Input
              label="Land Area"
              name="landArea"
              type="number"
              step="0.1"
              min="0.1"
              value={formData.landArea}
              onChange={handleChange}
              error={errors.landArea}
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

          <div className="flex items-center pt-6">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                name="irrigationAvailable"
                checked={formData.irrigationAvailable}
                onChange={handleChange}
                className="w-4 h-4 rounded text-forest-600 focus:ring-forest-500"
              />
              <span className="flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-sky-500" />
                Assured Irrigation Available
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Optional Soil Lab Test Measurements */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Soil Test & Nutrient Measurements (Optional)
          </h4>
          <span className="text-[11px] text-slate-400 italic">Leave blank if no lab report</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Input
            label="Soil pH (0-14)"
            name="soilPH"
            type="number"
            step="0.1"
            min="0"
            max="14"
            value={formData.soilPH}
            onChange={handleChange}
            placeholder="e.g. 6.8"
            error={errors.soilPH}
          />

          <Input
            label="Nitrogen (kg/ha)"
            name="nitrogen"
            type="number"
            min="0"
            value={formData.nitrogen}
            onChange={handleChange}
            placeholder="e.g. 240"
          />

          <Input
            label="Phosphorus (kg/ha)"
            name="phosphorus"
            type="number"
            min="0"
            value={formData.phosphorus}
            onChange={handleChange}
            placeholder="e.g. 35"
          />

          <Input
            label="Potassium (kg/ha)"
            name="potassium"
            type="number"
            min="0"
            value={formData.potassium}
            onChange={handleChange}
            placeholder="e.g. 180"
          />
        </div>
      </div>

      {/* Weather & Preferences */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100">
          Climatic Conditions & Farmer Preferences (Optional)
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Temperature (°C)"
            name="temperature"
            type="number"
            value={formData.temperature}
            onChange={handleChange}
            placeholder="e.g. 28"
          />

          <Input
            label="Rainfall (mm)"
            name="rainfall"
            type="number"
            value={formData.rainfall}
            onChange={handleChange}
            placeholder="e.g. 850"
          />

          <Input
            label="Preferred Crop Category"
            name="preferredCategory"
            value={formData.preferredCategory}
            onChange={handleChange}
            placeholder="e.g. Pulses, Millets, Vegetables"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-4 border-t border-slate-100">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          icon={Sparkles}
          className="w-full sm:w-auto"
        >
          {loading ? "Analyzing Land & Sowing Conditions..." : "Generate AI Crop Recommendations"}
        </Button>
      </div>
    </form>
  );
};

