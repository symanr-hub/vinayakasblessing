import { irrigationService } from "../services/irrigation.service.js";

export const recommendIrrigation = async (req, res, next) => {
  try {
    const result = await irrigationService.createIrrigationAdvisory(
      req.supabase,
      req.user.id,
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Irrigation advisory generated successfully",
      data: result,
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

export const getIrrigationAdvisories = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 20;
    const offset = parseInt(req.query.offset, 10) || 0;

    const result = await irrigationService.getIrrigationAdvisories(
      req.supabase,
      req.user.id,
      { limit, offset }
    );

    res.json({
      success: true,
      message: "Irrigation advisories retrieved successfully",
      data: result,
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

export const getIrrigationAdvisoryById = async (req, res, next) => {
  try {
    const result = await irrigationService.getIrrigationAdvisoryById(
      req.supabase,
      req.user.id,
      req.params.id
    );

    res.json({
      success: true,
      message: "Irrigation advisory details retrieved",
      data: result,
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteIrrigationAdvisory = async (req, res, next) => {
  try {
    await irrigationService.deleteIrrigationAdvisory(
      req.supabase,
      req.user.id,
      req.params.id
    );

    res.json({
      success: true,
      message: "Irrigation advisory deleted successfully",
      data: null,
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

