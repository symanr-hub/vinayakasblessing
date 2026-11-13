import { cropService } from "../services/crop.service.js";

export const recommendCrop = async (req, res, next) => {
  try {
    const result = await cropService.createRecommendation(
      req.supabase,
      req.user.id,
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Crop recommendations generated successfully",
      data: result,
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

export const getRecommendations = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 20;
    const offset = parseInt(req.query.offset, 10) || 0;

    const result = await cropService.getRecommendations(req.supabase, req.user.id, {
      limit,
      offset,
    });

    res.json({
      success: true,
      message: "Crop recommendations retrieved successfully",
      data: result,
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

export const getRecommendationById = async (req, res, next) => {
  try {
    const result = await cropService.getRecommendationById(
      req.supabase,
      req.user.id,
      req.params.id
    );

    res.json({
      success: true,
      message: "Crop recommendation report retrieved",
      data: result,
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteRecommendation = async (req, res, next) => {
  try {
    await cropService.deleteRecommendation(
      req.supabase,
      req.user.id,
      req.params.id
    );

    res.json({
      success: true,
      message: "Crop recommendation report deleted successfully",
      data: null,
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

