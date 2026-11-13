import crypto from "crypto";
import { geminiService } from "./gemini.service.js";
import { buildCultivationCalendarPrompt } from "../prompts/index.js";

export const calendarService = {
  generateCalendar: async (supabase, userId, inputData) => {
    const prompt = buildCultivationCalendarPrompt(inputData);
    const generated = await geminiService.generateCultivationCalendar(prompt);

    // Assign unique IDs to activities so frontend can toggle individual checklist items
    const activitiesWithIds = (generated.activities || []).map((activity) => ({
      id: crypto.randomUUID(),
      stage: activity.stage,
      dayFromStart: activity.dayFromStart,
      dayToStart: activity.dayToStart,
      description: activity.description,
      importance: activity.importance || "medium",
      completed: false,
    }));

    const calendarRecord = {
      ...generated,
      activities: activitiesWithIds,
    };

    const { data, error } = await supabase
      .from("cultivation_calendars")
      .insert({
        user_id: userId,
        farm_id: inputData.farmId || null,
        crop_name: inputData.cropName,
        start_date: inputData.startDate,
        activities: calendarRecord,
      })
      .select()
      .single();

    if (error) {
      console.error("Database insert error [cultivation_calendars]:", error);
      throw new Error(`Failed to save cultivation calendar: ${error.message}`);
    }

    return data;
  },

  getCalendars: async (supabase, userId, { limit = 20, offset = 0 } = {}) => {
    const { data, error, count } = await supabase
      .from("cultivation_calendars")
      .select("*, farms(farm_name, location)", { count: "exact" })
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Failed to fetch cultivation calendars: ${error.message}`);
    }

    return { calendars: data, total: count };
  },

  getCalendarById: async (supabase, userId, id) => {
    const { data, error } = await supabase
      .from("cultivation_calendars")
      .select("*, farms(farm_name, location)")
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        const err = new Error("Cultivation calendar not found");
        err.statusCode = 404;
        throw err;
      }
      throw new Error(`Failed to fetch cultivation calendar: ${error.message}`);
    }

    return data;
  },

  updateCalendarActivities: async (supabase, userId, id, updatedActivities) => {
    // Fetch existing calendar first
    const { data: existing, error: fetchErr } = await supabase
      .from("cultivation_calendars")
      .select("activities")
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (fetchErr || !existing) {
      const err = new Error("Calendar not found to update");
      err.statusCode = 404;
      throw err;
    }

    const currentActivitiesObj = existing.activities || {};
    const updatedActivitiesObj = {
      ...currentActivitiesObj,
      activities: updatedActivities,
    };

    const { data, error } = await supabase
      .from("cultivation_calendars")
      .update({
        activities: updatedActivitiesObj,
      })
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update calendar activities: ${error.message}`);
    }

    return data;
  },

  deleteCalendar: async (supabase, userId, id) => {
    const { error } = await supabase
      .from("cultivation_calendars")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      throw new Error(`Failed to delete cultivation calendar: ${error.message}`);
    }

    return true;
  },
};

