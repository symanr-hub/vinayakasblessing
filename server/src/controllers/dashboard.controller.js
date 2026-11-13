import { dashboardService } from "../services/dashboard.service.js";

export const getDashboardSummary = async (req, res, next) => {
  try {
    const summary = await dashboardService.getSummary(req.supabase, req.user.id);
    res.json({
      success: true,
      message: "Dashboard summary retrieved successfully",
      data: summary,
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

export const getRecentActivities = async (req, res, next) => {
  try {
    const activities = await dashboardService.getRecentActivities(req.supabase, req.user.id);
    res.json({
      success: true,
      message: "Recent activities retrieved successfully",
      data: activities,
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

export const getUpcomingTasks = async (req, res, next) => {
  try {
    const tasks = await dashboardService.getUpcomingTasks(req.supabase, req.user.id);
    res.json({
      success: true,
      message: "Upcoming farming tasks retrieved successfully",
      data: tasks,
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

