import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { WelcomeCard } from "../components/dashboard/WelcomeCard";
import { StatisticsCard } from "../components/dashboard/StatisticsCard";
import { QuickActionCard } from "../components/dashboard/QuickActionCard";
import { RecentAdvisories } from "../components/dashboard/RecentAdvisories";
import { UpcomingTasks } from "../components/dashboard/UpcomingTasks";
import { LoadingScreen } from "../components/common/LoadingScreen";
import { ErrorState } from "../components/common/ErrorState";
import {
  Sprout,
  FlaskConical,
  Wheat,
  Droplets,
  Bug,
  CalendarDays,
  MapPin,
  TrendingUp,
} from "lucide-react";

export const DashboardPage = () => {
  const { profile } = useAuth();
  const [summary, setSummary] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [summaryRes, activitiesRes, tasksRes] = await Promise.all([
        api.getDashboardSummary(),
        api.getRecentActivities(),
        api.getUpcomingTasks(),
      ]);

      setSummary(summaryRes.data);
      setRecentActivities(activitiesRes.data || []);
      setUpcomingTasks(tasksRes.data || []);
    } catch (err) {
      console.error("Dashboard data load error:", err);
      setError(err.message || "Failed to load dashboard records from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) {
    return <LoadingScreen message="Loading your personalized agricultural dashboard..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadDashboardData} />;
  }

  const counts = summary?.counts || {};

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Welcome Card with real profile & completion percentage */}
      <WelcomeCard
        profile={summary?.profile || profile}
        completion={summary?.profileCompletion || 30}
      />

      {/* 2. Real Database Statistics Counter Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatisticsCard
          title="Total Advisories"
          value={summary?.totalAdvisories ?? 0}
          subtitle="Saved reports"
          icon={TrendingUp}
          color="forest"
        />
        <StatisticsCard
          title="Crop Checks"
          value={counts.crops ?? 0}
          subtitle="Suitability rankings"
          icon={Sprout}
          color="forest"
        />
        <StatisticsCard
          title="Soil Reports"
          value={counts.soil ?? 0}
          subtitle="Health assessments"
          icon={FlaskConical}
          color="harvest"
        />
        <StatisticsCard
          title="Water Guides"
          value={counts.irrigation ?? 0}
          subtitle="Irrigation plans"
          icon={Droplets}
          color="sky"
        />
        <StatisticsCard
          title="Pest Checks"
          value={counts.disease ?? 0}
          subtitle="IPM diagnostics"
          icon={Bug}
          color="rose"
        />
        <StatisticsCard
          title="Farm Plots"
          value={counts.farms ?? 0}
          subtitle="Parcels tracked"
          icon={MapPin}
          color="purple"
        />
      </div>

      {/* 3. Quick Action Launchers */}
      <QuickActionCard />

      {/* 4. Two-Column Live Records Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UpcomingTasks tasks={upcomingTasks} />
        <RecentAdvisories activities={recentActivities} />
      </div>
    </div>
  );
};

