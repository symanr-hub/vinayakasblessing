import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import { Input } from "../components/common/Input";
import { Select } from "../components/common/Select";
import { Button } from "../components/common/Button";
import { SUPPORTED_LANGUAGES } from "../utils/translations";
import { LoadingScreen } from "../components/common/LoadingScreen";
import { User, Save, CheckCircle, AlertCircle, Droplets, MapPin } from "lucide-react";

export const ProfilePage = () => {
  const { user, profile, updateProfile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    country: "India",
    state: "",
    district: "",
    village: "",
    preferred_language: "en",
    farming_experience: 0,
    land_area: "",
    land_unit: "acre",
    farming_type: "Conventional",
    irrigation_available: false,
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        phone: profile.phone || "",
        country: profile.country || "India",
        state: profile.state || "",
        district: profile.district || "",
        village: profile.village || "",
        preferred_language: profile.preferred_language || "en",
        farming_experience: profile.farming_experience ?? 0,
        land_area: profile.land_area !== null && profile.land_area !== undefined ? profile.land_area : "",
        land_unit: profile.land_unit || "acre",
        farming_type: profile.farming_type || "Conventional",
        irrigation_available: Boolean(profile.irrigation_available),
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setSuccess(false);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.full_name.trim()) {
      setError("Full name is required");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const payload = {
        ...formData,
        farming_experience: Number(formData.farming_experience) || 0,
        land_area: formData.land_area !== "" ? Number(formData.land_area) : null,
      };

      // Call profile update on backend API and AuthContext
      await api.updateProfile(payload);
      await updateProfile(payload);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      console.error("Profile update error:", err);
      setError(err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Farmer Profile
          </h2>
          <p className="text-xs text-slate-500">
            Keep your agricultural background updated for more accurate crop and soil advisories.
          </p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-forest-100 text-forest-700 flex items-center justify-center">
          <User className="w-5 h-5" />
        </div>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Profile updated successfully! AI prompts will reflect these settings.</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        {/* Personal Details */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100">
            Personal Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Full Name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="e.g. Anand Gowda"
              required
            />

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Account Email
              </label>
              <input
                type="text"
                value={user?.email || ""}
                disabled
                className="w-full rounded-xl border border-slate-200 bg-slate-100 text-slate-500 text-sm px-3.5 py-2.5 cursor-not-allowed"
              />
            </div>

            <Input
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
            />
          </div>
        </div>

        {/* Location & Region */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-forest-600" />
            Geographic Location (India-First Architecture)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Input
              label="Country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="India"
              required
            />

            <Input
              label="State"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="e.g. Karnataka"
            />

            <Input
              label="District"
              name="district"
              value={formData.district}
              onChange={handleChange}
              placeholder="e.g. Mandya"
            />

            <Input
              label="Village / Locality"
              name="village"
              value={formData.village}
              onChange={handleChange}
              placeholder="e.g. Maddur"
            />
          </div>
        </div>

        {/* Agricultural Background */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100">
            Farming Characteristics
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Farming Experience (Years)"
              name="farming_experience"
              type="number"
              min="0"
              value={formData.farming_experience}
              onChange={handleChange}
            />

            <div className="flex gap-2">
              <Input
                label="Total Land Area"
                name="land_area"
                type="number"
                step="0.1"
                min="0"
                value={formData.land_area}
                onChange={handleChange}
                placeholder="e.g. 5.0"
              />
              <div className="w-32">
                <Select
                  label="Unit"
                  name="land_unit"
                  value={formData.land_unit}
                  onChange={handleChange}
                  options={["acre", "hectare", "sqm", "bigha", "guntha"]}
                />
              </div>
            </div>

            <Select
              label="Primary Farming Practice"
              name="farming_type"
              value={formData.farming_type}
              onChange={handleChange}
              options={["Conventional", "Organic", "Mixed", "Hydroponic", "Natural"]}
            />
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                name="irrigation_available"
                checked={formData.irrigation_available}
                onChange={handleChange}
                className="w-4 h-4 rounded text-forest-600 focus:ring-forest-500"
              />
              <span className="flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-sky-500" />
                Permanent / Assured Irrigation Facility Available on Farm
              </span>
            </label>
          </div>
        </div>

        {/* Advisory Language */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100">
            Advisory Language Preference
          </h3>

          <div className="max-w-xs">
            <Select
              label="Preferred Language for AI Guidance"
              name="preferred_language"
              value={formData.preferred_language}
              onChange={handleChange}
              options={SUPPORTED_LANGUAGES.map((l) => ({
                value: l.code,
                label: `${l.nativeName} (${l.name})`,
              }))}
              hint="AI crop recommendations, disease reports, and chatbot will automatically respond in this language."
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4 border-t border-slate-100">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={saving}
            icon={Save}
          >
            {saving ? "Saving Changes..." : "Save Profile Details"}
          </Button>
        </div>
      </form>
    </div>
  );
};

