import { calendarService } from "../services/calendar.service.js";

export const generateCalendar = async (req, res, next) => {
  try {
    const result = await calendarService.generateCalendar(
      req.supabase,
      req.user.id,
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Crop cultivation calendar generated successfully",
      data: result,
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

export const getCalendars = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 20;
    const offset = parseInt(req.query.offset, 10) || 0;

    const result = await calendarService.getCalendars(
      req.supabase,
      req.user.id,
      { limit, offset }
    );

    res.json({
      success: true,
      message: "Cultivation calendars retrieved successfully",
      data: result,
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

export const getCalendarById = async (req, res, next) => {
  try {
    const result = await calendarService.getCalendarById(
      req.supabase,
      req.user.id,
      req.params.id
    );

    res.json({
      success: true,
      message: "Cultivation calendar retrieved",
      data: result,
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

export const updateCalendarActivities = async (req, res, next) => {
  try {
    const result = await calendarService.updateCalendarActivities(
      req.supabase,
      req.user.id,
      req.params.id,
      req.body.activities
    );

    res.json({
      success: true,
      message: "Cultivation activities updated successfully",
      data: result,
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteCalendar = async (req, res, next) => {
  try {
    await calendarService.deleteCalendar(
      req.supabase,
      req.user.id,
      req.params.id
    );

    res.json({
      success: true,
      message: "Cultivation calendar deleted successfully",
      data: null,
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

