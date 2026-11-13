export const getProfile = async (req, res, next) => {
  try {
    const { data, error } = await req.supabase
      .from("profiles")
      .select("*")
      .eq("id", req.user.id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    // If profile doesn't exist yet, insert a baseline record
    if (!data) {
      const { data: newProfile, error: insertErr } = await req.supabase
        .from("profiles")
        .insert({
          id: req.user.id,
          full_name: req.user.user_metadata?.full_name || "Farmer",
          preferred_language: req.user.user_metadata?.preferred_language || "en",
        })
        .select()
        .single();

      if (insertErr) throw insertErr;
      return res.json({
        success: true,
        message: "Profile retrieved successfully",
        data: newProfile,
        error: null,
      });
    }

    res.json({
      success: true,
      message: "Profile retrieved successfully",
      data: data,
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const updates = {
      ...req.body,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await req.supabase
      .from("profiles")
      .update(updates)
      .eq("id", req.user.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      message: "Farmer profile updated successfully",
      data: data,
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

