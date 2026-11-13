import React, { useState } from "react";
import { Input } from "../common/Input";
import { Select } from "../common/Select";
import { Textarea } from "../common/Textarea";
import { Button } from "../common/Button";
import { ImageUploader } from "./ImageUploader";
import { useAuth } from "../../context/AuthContext";
import { Bug, Sparkles } from "lucide-react";

export const DiseaseDetectionForm = ({ onSubmit, loading = false }) => {
  const { language } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [formData, setFormData] = useState({
    cropName: "Paddy / Rice",
    affectedPlantPart: "Leaves",
    symptoms: "",
    duration: "3-5 days",
    visibleDamage: "",
    weatherCondition: "High humidity and intermittent rain",
    language: language || "en",
  });

  const [errors, setErrors] = useState({});

  const handleFileChange = (file) => {
    setSelectedFile(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  const handleClearImage = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.cropName.trim()) errs.cropName = "Crop name is required";
    if (!formData.symptoms.trim() || formData.symptoms.length < 5) {
      errs.symptoms = "Please provide detailed symptom observations (at least 5 characters)";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Use FormData for multipart submission
    const formPayload = new FormData();
    formPayload.append("cropName", formData.cropName);
    formPayload.append("affectedPlantPart", formData.affectedPlantPart);
    formPayload.append("symptoms", formData.symptoms);
    formPayload.append("duration", formData.duration);
    formPayload.append("visibleDamage", formData.visibleDamage || "");
    formPayload.append("weatherCondition", formData.weatherCondition || "");
    formPayload.append("language", language || "en");

    if (selectedFile) {
      formPayload.append("image", selectedFile);
    }

    onSubmit(formPayload);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900">Crop Pathology & Pest Symptoms</h3>
          <p className="text-xs text-slate-500">
            Describe symptoms in detail or attach a photo for AI visual inspection.
          </p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
          <Bug className="w-5 h-5" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          label="Crop Name"
          name="cropName"
          value={formData.cropName}
          onChange={handleChange}
          placeholder="e.g. Cotton, Tomato, Wheat"
          error={errors.cropName}
          required
        />

        <Select
          label="Affected Plant Part"
          name="affectedPlantPart"
          value={formData.affectedPlantPart}
          onChange={handleChange}
          options={[
            "Leaves",
            "Stem",
            "Roots",
            "Flowers",
            "Fruit/Grain",
            "Whole Plant",
            "Other",
          ]}
          required
        />

        <Select
          label="Duration of Problem"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          options={[
            "Just noticed today",
            "1-2 days",
            "3-5 days",
            "1-2 weeks",
            "More than 2 weeks",
          ]}
          required
        />
      </div>

      {/* Symptoms Description */}
      <Textarea
        label="Observed Symptoms & Patterns"
        name="symptoms"
        value={formData.symptoms}
        onChange={handleChange}
        placeholder="Describe spot shapes, color changes (yellowing, browning), powdery coating, leaf curling, wilting, or insect holes..."
        rows={3}
        error={errors.symptoms}
        required
      />

      {/* Visible Damage and Weather */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Visible Pests / Insects / Larvae"
          name="visibleDamage"
          value={formData.visibleDamage}
          onChange={handleChange}
          placeholder="e.g. Whiteflies under leaves, green caterpillars, sticky honeydew"
        />

        <Input
          label="Recent Weather / Moisture Conditions"
          name="weatherCondition"
          value={formData.weatherCondition}
          onChange={handleChange}
          placeholder="e.g. Continuous rain, dry heat, cloudy weather"
        />
      </div>

      {/* Image Upload Component */}
      <ImageUploader
        onFileSelected={handleFileChange}
        previewUrl={previewUrl}
        onClear={handleClearImage}
        disabled={loading}
      />

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
          {loading ? "Diagnosing Symptoms..." : "Analyze Disease & Recommend IPM"}
        </Button>
      </div>
    </form>
  );
};

