import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { CropRecommendationCard } from "../components/agriculture/CropRecommendationCard";
import { SoilHealthCard } from "../components/agriculture/SoilHealthCard";
import { FertilizerAdvisoryCard } from "../components/agriculture/FertilizerAdvisoryCard";
import { IrrigationAdvisoryCard } from "../components/agriculture/IrrigationAdvisoryCard";
import { DiseaseResultCard } from "../components/agriculture/DiseaseResultCard";
import { CultivationTimeline } from "../components/agriculture/CultivationTimeline";
import { LoadingScreen } from "../components/common/LoadingScreen";
import { ErrorState } from "../components/common/ErrorState";
import { Button } from "../components/common/Button";
import { AdvisoryWarning } from "../components/common/AdvisoryWarning";
import { ArrowLeft, Printer, Calendar, MapPin } from "lucide-react";
import { format, parseISO } from "date-fns";

export const AdvisoryDetailsPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const type = searchParams.get("type") || "crop";

  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecord = async () => {
    try {
      setLoading(true);
      setError(null);
      let res;

      switch (type) {
        case "crop":
          res = await api.getCropRecommendationById(id);
          break;
        case "soil":
          res = await api.getSoilReportById(id);
          break;
        case "fertilizer":
          res = await api.getFertilizerAdvisoryById(id);
          break;
        case "irrigation":
          res = await api.getIrrigationAdvisoryById(id);
          break;
        case "disease":
          res = await api.getDiseaseReportById(id);
          break;
        case "calendar":
          res = await api.getCalendarById(id);
          break;
        default:
          res = await api.getCropRecommendationById(id);
      }

      setRecord(res.data);
    } catch (err) {
      console.error("Error fetching advisory details:", err);
      setError(err.message || "Failed to load individual advisory report.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecord();
  }, [id, type]);

  if (loading) {
    return <LoadingScreen message="Retrieving advisory report..." />;
  }

  if (error || !record) {
    return <ErrorState message={error || "Report not found"} onRetry={fetchRecord} />;
  }

  let formattedDate = "";
  try {
    if (record.created_at) {
      formattedDate = format(parseISO(record.created_at), "MMMM dd, yyyy • h:mm a");
    }
  } catch (e) {
    // fallback
  }

  return (
    <div className="space-y-6 pb-16 max-w-5xl mx-auto">
      {/* Top Action Nav */}
      <div className="flex items-center justify-between">
        <Link
          to="/history"
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Advisory History</span>
        </Link>

        <Button
          variant="outline"
          size="sm"
          icon={Printer}
          onClick={() => window.print()}
        >
          Print Report
        </Button>
      </div>

      {/* Report Header Metadata */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-forest-100 text-forest-800">
            {type.toUpperCase()} ADVISORY REPORT
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
            {record.crop_name || record.input_data?.season || record.soil_data?.soilType || "Agricultural"} Analysis
          </h2>
          <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {formattedDate}
            </span>
            {record.farms?.farm_name && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-forest-600" />
                Plot: <b>{record.farms.farm_name}</b>
              </span>
            )}
          </div>
        </div>

        <div className="text-right text-xs text-slate-400">
          Report ID: <span className="font-mono text-slate-600">{id.slice(0, 8)}...</span>
        </div>
      </div>

      {/* Specialized Rendering by Type */}
      {type === "crop" && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-forest-900 text-white space-y-1">
            <h4 className="text-xs uppercase font-bold text-harvest-400">Suitability Assessment</h4>
            <p className="text-sm">{record.recommendations?.summary}</p>
          </div>

          <div className="space-y-4">
            {(record.recommendations?.recommendations || []).map((rec, idx) => (
              <CropRecommendationCard key={idx} recommendation={rec} />
            ))}
          </div>

          <AdvisoryWarning
            warnings={record.recommendations?.warnings}
            dataLimitations={record.recommendations?.dataLimitations}
          />
        </div>
      )}

      {type === "soil" && <SoilHealthCard report={record} />}

      {type === "fertilizer" && <FertilizerAdvisoryCard advisory={record} />}

      {type === "irrigation" && <IrrigationAdvisoryCard advisory={record} />}

      {type === "disease" && <DiseaseResultCard report={record} />}

      {type === "calendar" && (
        <CultivationTimeline calendar={record} />
      )}
    </div>
  );
};

