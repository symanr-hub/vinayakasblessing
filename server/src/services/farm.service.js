export const farmService = {
  createFarm: async (supabase, userId, farmData) => {
    const { data, error } = await supabase
      .from("farms")
      .insert({
        user_id: userId,
        farm_name: farmData.farm_name,
        location: farmData.location || null,
        state: farmData.state || null,
        district: farmData.district || null,
        soil_type: farmData.soil_type || null,
        soil_ph: farmData.soil_ph !== undefined ? farmData.soil_ph : null,
        land_area: farmData.land_area,
        land_unit: farmData.land_unit || "acre",
        irrigation_method: farmData.irrigation_method || null,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create farm: ${error.message}`);
    }

    return data;
  },

  getFarms: async (supabase, userId) => {
    const { data, error } = await supabase
      .from("farms")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch farms: ${error.message}`);
    }

    return data;
  },

  getFarmById: async (supabase, userId, id) => {
    const { data, error } = await supabase
      .from("farms")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        const err = new Error("Farm not found");
        err.statusCode = 404;
        throw err;
      }
      throw new Error(`Failed to fetch farm: ${error.message}`);
    }

    return data;
  },

  updateFarm: async (supabase, userId, id, farmData) => {
    const { data, error } = await supabase
      .from("farms")
      .update(farmData)
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update farm: ${error.message}`);
    }

    return data;
  },

  deleteFarm: async (supabase, userId, id) => {
    const { error } = await supabase
      .from("farms")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      throw new Error(`Failed to delete farm: ${error.message}`);
    }

    return true;
  },
};

