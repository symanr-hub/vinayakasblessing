import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../services/supabase";
import { Select } from "../components/common/Select";
import { Input } from "../components/common/Input";
import { Button } from "../components/common/Button";
import { SUPPORTED_LANGUAGES } from "../utils/translations";
import {
  Settings,
  Globe,
  KeyRound,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export const SettingsPage = () => {
  const { language, setLanguage, user, updateProfile } = useAuth();

  const [selectedLang, setSelectedLang] = useState(language);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState(null);
  const [langSaved, setLangSaved] = useState(false);

  const handleLanguageSave = async (e) => {
    e.preventDefault();
    setLanguage(selectedLang);
    localStorage.setItem("agro_lang_manual", "true");
    try {
      await updateProfile({ preferred_language: selectedLang });
      setLangSaved(true);
      setTimeout(() => setLangSaved(false), 3000);
    } catch (err) {
      console.error("Failed to persist language in profile:", err);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    try {
      setPasswordLoading(true);
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
      setPasswordSuccess(true);
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Password update error:", err);
      setPasswordError(err.message || "Failed to update password.");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Account & Advisory Settings
          </h2>
          <p className="text-xs text-slate-500">
            Manage your interface language, authentication security, and agricultural privacy controls.
          </p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
          <Settings className="w-5 h-5" />
        </div>
      </div>

      {/* 1. Language Preferences */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Globe className="w-4 h-4 text-forest-600" />
          <h3 className="text-sm font-bold text-slate-900">
            Language & Regional Localization
          </h3>
        </div>

        {langSaved && (
          <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Language preferences saved! All AI crop responses will follow this language.</span>
          </div>
        )}

        <form onSubmit={handleLanguageSave} className="space-y-4 max-w-md">
          <Select
            label="Application & AI Output Language"
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
            options={SUPPORTED_LANGUAGES.map((l) => ({
              value: l.code,
              label: `${l.nativeName} (${l.name})`,
            }))}
            hint="Supports Kannada (ಕನ್ನಡ), Hindi (हिन्दी), Urdu (اردو), Telugu (తెలుగు), Tamil (தமிழ்), Malayalam (മലയാളം), and English."
          />

          <Button type="submit" variant="primary" size="sm">
            Update Language
          </Button>
        </form>
      </div>

      {/* 2. Password & Account Security */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <KeyRound className="w-4 h-4 text-amber-600" />
          <h3 className="text-sm font-bold text-slate-900">
            Password & Security
          </h3>
        </div>

        {passwordSuccess && (
          <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Password updated successfully!</span>
          </div>
        )}

        {passwordError && (
          <div className="p-3 bg-rose-50 text-rose-800 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>{passwordError}</span>
          </div>
        )}

        <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-md">
          <Input
            label="New Password"
            name="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Min 6 characters"
          />

          <Input
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter new password"
          />

          <Button
            type="submit"
            variant="secondary"
            size="sm"
            loading={passwordLoading}
            disabled={!newPassword || !confirmPassword}
          >
            Change Password
          </Button>
        </form>
      </div>

      {/* 3. Privacy & Row Level Security Notice */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-3">
        <div className="flex items-center gap-2 text-forest-800 font-bold text-sm">
          <ShieldCheck className="w-5 h-5 text-forest-600" />
          <span>Agricultural Data Privacy & Isolation</span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Your farm boundaries, crop yields, soil tests, and photos are strictly isolated using PostgreSQL Row Level Security (RLS) linked to your authenticated Supabase user ID. No other farmer can access or query your advisory records. You retain full control to delete individual reports or your entire account history at any time.
        </p>
      </div>
    </div>
  );
};

