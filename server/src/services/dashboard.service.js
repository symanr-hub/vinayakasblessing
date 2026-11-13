import { differenceInDays, parseISO, addDays, format } from "date-fns";

export const dashboardService = {
  getSummary: async (supabase, userId) => {
    // Run parallel counts for genuine stats
    const [
      cropCountRes,
      soilCountRes,
      fertCountRes,
      irrigCountRes,
      diseaseCountRes,
      calendarCountRes,
      farmCountRes,
      profileRes,
    ] = await Promise.all([
      supabase.from("crop_recommendations").select("id", { count: "exact", head: true }).eq("user_id", userId),
      supabase.from("soil_reports").select("id", { count: "exact", head: true }).eq("user_id", userId),
      supabase.from("fertilizer_advisories").select("id", { count: "exact", head: true }).eq("user_id", userId),
      supabase.from("irrigation_advisories").select("id", { count: "exact", head: true }).eq("user_id", userId),
      supabase.from("disease_reports").select("id", { count: "exact", head: true }).eq("user_id", userId),
      supabase.from("cultivation_calendars").select("id", { count: "exact", head: true }).eq("user_id", userId),
      supabase.from("farms").select("id", { count: "exact", head: true }).eq("user_id", userId),
      supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
    ]);

    const cropCount = cropCountRes.count || 0;
    const soilCount = soilCountRes.count || 0;
    const fertCount = fertCountRes.count || 0;
    const irrigCount = irrigCountRes.count || 0;
    const diseaseCount = diseaseCountRes.count || 0;
    const calendarCount = calendarCountRes.count || 0;
    const farmCount = farmCountRes.count || 0;

    const totalAdvisories = cropCount + soilCount + fertCount + irrigCount + diseaseCount + calendarCount;

    // Calculate real profile completion percentage based on stored profile fields
    let profileCompletion = 20; // baseline registered
    const profile = profileRes.data;
    if (profile) {
      if (profile.full_name) profileCompletion += 15;
      if (profile.state && profile.district) profileCompletion += 20;
      if (profile.land_area && profile.land_area > 0) profileCompletion += 15;
      if (profile.farming_experience && profile.farming_experience > 0) profileCompletion += 10;
      if (profile.farming_type) profileCompletion += 10;
      if (profile.phone) profileCompletion += 10;
    }
    profileCompletion = Math.min(100, profileCompletion);

    return {
      totalAdvisories,
      counts: {
        crops: cropCount,
        soil: soilCount,
        fertilizer: fertCount,
        irrigation: irrigCount,
        disease: diseaseCount,
        calendars: calendarCount,
        farms: farmCount,
      },
      profileCompletion,
      profile: profile || null,
    };
  },

  getRecentActivities: async (supabase, userId) => {
    // Fetch recent items from each advisory table
    const [crops, soils, ferts, irrigs, diseases, calendars] = await Promise.all([
      supabase.from("crop_recommendations").select("id, input_data, created_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(3),
      supabase.from("soil_reports").select("id, soil_data, created_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(3),
      supabase.from("fertilizer_advisories").select("id, crop_name, created_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(3),
      supabase.from("irrigation_advisories").select("id, crop_name, created_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(3),
      supabase.from("disease_reports").select("id, crop_name, created_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(3),
      supabase.from("cultivation_calendars").select("id, crop_name, start_date, created_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(3),
    ]);

    const combined = [
      ...(crops.data || []).map(item => ({
        id: item.id,
        type: "crop",
        title: `Crop Recommendation: ${item.input_data?.season || "General"} Season`,
        subtitle: `${item.input_data?.district || ""}, ${item.input_data?.state || ""}`,
        created_at: item.created_at,
        link: `/history/${item.id}?type=crop`,
      })),
      ...(soils.data || []).map(item => ({
        id: item.id,
        type: "soil",
        title: `Soil Analysis: ${item.soil_data?.soilType || "Soil Test"}`,
        subtitle: `pH: ${item.soil_data?.soilPH || "N/A"}`,
        created_at: item.created_at,
        link: `/history/${item.id}?type=soil`,
      })),
      ...(ferts.data || []).map(item => ({
        id: item.id,
        type: "fertilizer",
        title: `Fertilizer Advisory: ${item.crop_name}`,
        subtitle: `Nutrition guidance`,
        created_at: item.created_at,
        link: `/history/${item.id}?type=fertilizer`,
      })),
      ...(irrigs.data || []).map(item => ({
        id: item.id,
        type: "irrigation",
        title: `Irrigation Advisory: ${item.crop_name}`,
        subtitle: `Water management schedule`,
        created_at: item.created_at,
        link: `/history/${item.id}?type=irrigation`,
      })),
      ...(diseases.data || []).map(item => ({
        id: item.id,
        type: "disease",
        title: `Disease Check: ${item.crop_name}`,
        subtitle: `Plant diagnosis`,
        created_at: item.created_at,
        link: `/history/${item.id}?type=disease`,
      })),
      ...(calendars.data || []).map(item => ({
        id: item.id,
        type: "calendar",
        title: `Cultivation Plan: ${item.crop_name}`,
        subtitle: `Started ${item.start_date}`,
        created_at: item.created_at,
        link: `/cultivation-calendar`,
      })),
    ];

    // Sort by created_at DESC
    combined.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return combined.slice(0, 8);
  },

  getUpcomingTasks: async (supabase, userId) => {
    // Fetch user's active cultivation calendars
    const { data: calendars } = await supabase
      .from("cultivation_calendars")
      .select("id, crop_name, start_date, activities")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(5);

    const upcomingTasks = [];
    const today = new Date();

    (calendars || []).forEach(cal => {
      const activitiesList = cal.activities?.activities || [];
      const startDate = parseISO(cal.start_date || new Date().toISOString().split("T")[0]);

      activitiesList.forEach(act => {
        if (!act.completed) {
          const targetStartDate = addDays(startDate, act.dayFromStart);
          const targetEndDate = addDays(startDate, act.dayToStart);
          const daysFromToday = differenceInDays(targetStartDate, today);

          upcomingTasks.push({
            calendarId: cal.id,
            cropName: cal.crop_name,
            activityId: act.id,
            stage: act.stage,
            description: act.description,
            importance: act.importance,
            targetStartDate: format(targetStartDate, "MMM dd, yyyy"),
            targetEndDate: format(targetEndDate, "MMM dd, yyyy"),
            daysRemaining: daysFromToday,
            completed: act.completed,
          });
        }
      });
    });

    // Sort tasks by days remaining (closest upcoming first)
    upcomingTasks.sort((a, b) => a.daysRemaining - b.daysRemaining);

    return upcomingTasks.slice(0, 6);
  },
};

