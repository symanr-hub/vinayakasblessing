import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";
import { Select } from "../components/common/Select";
import { Modal } from "../components/common/Modal";
import { EmptyState } from "../components/common/EmptyState";
import { LoadingScreen } from "../components/common/LoadingScreen";
import { ConfirmationDialog } from "../components/common/ConfirmationDialog";
import { MapPin, Plus, Trash2, Edit3, Layers, Droplets } from "lucide-react";

export const FarmsPage = () => {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFarm, setEditingFarm] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [formData, setFormData] = useState({
    farm_name: "",
    location: "",
    state: "",
    district: "",
    soil_type: "Loamy soil",
    soil_ph: "",
    land_area: "",
    land_unit: "acre",
    irrigation_method: "Drip irrigation",
  });

  const loadFarms = async () => {
    try {
      setLoading(true);
      const res = await api.getFarms();
      setFarms(res.data || []);
    } catch (err) {
      console.error("Error loading farms:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFarms();
  }, []);

  const openCreateModal = () => {
    setEditingFarm(null);
    setFormData({
      farm_name: "",
      location: "",
      state: "",
      district: "",
      soil_type: "Loamy soil",
      soil_ph: "",
      land_area: "",
      land_unit: "acre",
      irrigation_method: "Drip irrigation",
    });
    setModalOpen(true);
  };

  const openEditModal = (farm) => {
    setEditingFarm(farm);
    setFormData({
      farm_name: farm.farm_name,
      location: farm.location || "",
      state: farm.state || "",
      district: farm.district || "",
      soil_type: farm.soil_type || "Loamy soil",
      soil_ph: farm.soil_ph !== null && farm.soil_ph !== undefined ? farm.soil_ph : "",
      land_area: farm.land_area,
      land_unit: farm.land_unit || "acre",
      irrigation_method: farm.irrigation_method || "Drip irrigation",
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.farm_name.trim() || !formData.land_area) return;

    try {
      setActionLoading(true);
      const payload = {
        ...formData,
        land_area: Number(formData.land_area),
        soil_ph: formData.soil_ph !== "" ? Number(formData.soil_ph) : null,
      };

      if (editingFarm) {
        await api.updateFarm(editingFarm.id, payload);
      } else {
        await api.createFarm(payload);
      }

      setModalOpen(false);
      loadFarms();
    } catch (err) {
      console.error("Error saving farm:", err);
      alert(err.message || "Failed to save farm plot");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setActionLoading(true);
      await api.deleteFarm(deleteTarget.id);
      setDeleteTarget(null);
      loadFarms();
    } catch (err) {
      console.error("Error deleting farm:", err);
      alert(err.message || "Failed to delete farm plot");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <LoadingScreen message="Loading your registered farm parcels..." />;
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            My Farm Parcels & Plots
          </h2>
          <p className="text-xs text-slate-500">
            Register specific agricultural plots to automatically populate soil, area, and irrigation parameters in advisories.
          </p>
        </div>
        <Button variant="primary" size="md" icon={Plus} onClick={openCreateModal}>
          Register New Farm Plot
        </Button>
      </div>

      {farms.length === 0 ? (
        <EmptyState
          icon={MapPin}
          title="No farm parcels registered"
          description="Register your plots so you can easily run crop and soil recommendations with one click."
          actionLabel="Register Farm Plot"
          onAction={openCreateModal}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {farms.map((farm) => (
            <div
              key={farm.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-forest-50 text-forest-700 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900">
                        {farm.farm_name}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {[farm.district, farm.state].filter(Boolean).join(", ") || "Location not set"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(farm)}
                      className="p-1.5 text-slate-400 hover:text-forest-700 hover:bg-forest-50 rounded-lg transition-colors"
                      title="Edit farm plot"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(farm)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete farm plot"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Area</span>
                    <span className="font-bold text-slate-800">
                      {farm.land_area} {farm.land_unit}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Soil</span>
                    <span className="font-bold text-slate-800 truncate block">
                      {farm.soil_type || "Standard"}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">pH Level</span>
                    <span className="font-bold text-slate-800">
                      {farm.soil_ph !== null && farm.soil_ph !== undefined ? farm.soil_ph : "Not tested"}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Irrigation</span>
                    <span className="font-bold text-slate-800 truncate block">
                      {farm.irrigation_method || "Rain-fed"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">Ready for Advisories</span>
                <span className="font-semibold text-forest-700">Active Plot ✓</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Farm Create/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingFarm ? "Edit Farm Parcel" : "Register New Farm Parcel"}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Plot / Farm Name"
            name="farm_name"
            value={formData.farm_name}
            onChange={(e) => setFormData({ ...formData, farm_name: e.target.value })}
            placeholder="e.g. North Acre Paddy Plot"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Plot Land Area"
              name="land_area"
              type="number"
              step="0.1"
              min="0.1"
              value={formData.land_area}
              onChange={(e) => setFormData({ ...formData, land_area: e.target.value })}
              placeholder="e.g. 3.5"
              required
            />
            <Select
              label="Area Unit"
              name="land_unit"
              value={formData.land_unit}
              onChange={(e) => setFormData({ ...formData, land_unit: e.target.value })}
              options={["acre", "hectare", "sqm", "bigha", "guntha"]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="Soil Type"
              name="soil_type"
              value={formData.soil_type}
              onChange={(e) => setFormData({ ...formData, soil_type: e.target.value })}
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
            />
            <Input
              label="Soil pH (0 - 14)"
              name="soil_ph"
              type="number"
              step="0.1"
              min="0"
              max="14"
              value={formData.soil_ph}
              onChange={(e) => setFormData({ ...formData, soil_ph: e.target.value })}
              placeholder="e.g. 6.8"
            />
          </div>

          <Select
            label="Irrigation Method"
            name="irrigation_method"
            value={formData.irrigation_method}
            onChange={(e) => setFormData({ ...formData, irrigation_method: e.target.value })}
            options={[
              "Drip irrigation",
              "Sprinkler irrigation",
              "Surface furrow",
              "Basin / Flood irrigation",
              "Rainwater harvested pond",
              "Rain-fed only",
            ]}
          />

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" loading={actionLoading}>
              {editingFarm ? "Update Farm Plot" : "Save Farm Plot"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Farm Plot?"
        message={`Are you sure you want to delete ${deleteTarget?.farm_name}? Previous advisories linked to this farm will be retained.`}
        loading={actionLoading}
      />
    </div>
  );
};

