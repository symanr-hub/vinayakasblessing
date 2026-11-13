import React, { useState } from "react";
import { Input } from "../common/Input";
import { Select } from "../common/Select";
import { Textarea } from "../common/Textarea";
import { Button } from "../common/Button";
import { useAuth } from "../../context/AuthContext";
import { FlaskConical, Sparkles } from "lucide-react";

export const SoilAnalysisForm = ({ onSubmit, loading = false }) => {
  const { language } = useAuth();

  const [formData, setFormData] = useState({
    soilType: "Loamy soil",
    soilTexture: "Medium loam",
    soilPH: "",
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    organicCarbon: "",
    electricalConductivity: "",
    micronutrients: "",
    laboratoryObservations: "",
    targetCrops: "",
    language: language || "en",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.soilType) errs.soilType = "Soil type is required";
    if (formData.soilPH !== "" && (Number(formData.soilPH) < 0 || Number(formData.soilPH) > 14)) {
      errs.soilPH = "pH must be between 0 and 14";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...formData,
      soilPH: formData.soilPH !== "" ? Number(formData.soilPH) : null,
      nitrogen: formData.nitrogen !== "" ? Number(formData.nitrogen) : null,
      phosphorus: formData.phosphorus !== "" ? Number(formData.phosphorus) : null,
      potassium: formData.potassium !== "" ? Number(formData.potassium) : null,
      organicCarbon: formData.organicCarbon !== "" ? Number(formData.organicCarbon) : null,
      electricalConductivity: formData.electricalConductivity !== "" ? Number(formData.electricalConductivity) : null,
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900">Soil Health Diagnostic Form</h3>
          <p className="text-xs text-slate-500">
            Enter available laboratory parameters or field observations. Incomplete fields will be treated responsibly.
          </p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
          <FlaskConical className="w-5 h-5" />
        </div>
      </div>

      {/* Basic Texture & pH */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
            "Silty soil",
            "Laterite soil",
          ]}
          error={errors.soilType}
          required
        />

        <Input
          label="Soil Texture / Feel"
          name="soilTexture"
          value={formData.soilTexture}
          onChange={handleChange}
          placeholder="e.g. Fine sand, Sandy clay, Silty loam"
        />

        <Input
          label="Soil pH (0 - 14)"
          name="soilPH"
          type="number"
          step="0.1"
          min="0"
          max="14"
          value={formData.soilPH}
          onChange={handleChange}
          placeholder="e.g. 6.5 (Neutral is ~7.0)"
          error={errors.soilPH}
        />
      </div>

      {/* Lab Chemical Parameters */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-1 border-b border-slate-100">
          Macronutrient Laboratory Results (Optional)
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Input
            label="Available Nitrogen (kg/ha)"
            name="nitrogen"
            type="number"
            min="0"
            value={formData.nitrogen}
            onChange={handleChange}
            placeholder="e.g. 210"
          />

          <Input
            label="Available Phosphorus (kg/ha)"
            name="phosphorus"
            type="number"
            min="0"
            value={formData.phosphorus}
            onChange={handleChange}
            placeholder="e.g. 25"
          />

          <Input
            label="Available Potassium (kg/ha)"
            name="potassium"
            type="number"
            min="0"
            value={formData.potassium}
            onChange={handleChange}
            placeholder="e.g. 195"
          />

          <Input
            label="Organic Carbon (%)"
            name="organicCarbon"
            type="number"
            step="0.01"
            min="0"
            value={formData.organicCarbon}
            onChange={handleChange}
            placeholder="e.g. 0.55"
          />
        </div>
      </div>

      {/* Secondary & Micronutrients */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Electrical Conductivity (EC in dS/m)"
          name="electricalConductivity"
          type="number"
          step="0.01"
          min="0"
          value={formData.electricalConductivity}
          onChange={handleChange}
          placeholder="e.g. 0.85 (Salinity indicator)"
        />

        <Input
          label="Micronutrient Status (Zn, Fe, B, Cu, Mn)"
          name="micronutrients"
          value={formData.micronutrients}
          onChange={handleChange}
          placeholder="e.g. Zinc deficient, Boron normal"
        />
      </div>

      {/* Target Crops & Observations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Planned Crops for this Field"
          name="targetCrops"
          value={formData.targetCrops}
          onChange={handleChange}
          placeholder="e.g. Cotton, Groundnut, Maize"
        />

        <Textarea
          label="Laboratory Notes or Visible Soil Observations"
          name="laboratoryObservations"
          value={formData.laboratoryObservations}
          onChange={handleChange}
          placeholder="e.g. Soil cracks when dry, white salt deposits visible on ridges"
          rows={2}
        />
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
          {loading ? "Analyzing Soil Fertility..." : "Generate Soil Health Assessment"}
        </Button>
      </div>
    </form>
  );
};

