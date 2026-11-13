import { soilService } from "../services/soil.service.js";

export const analyzeSoil = async (req, res, next) => {
  try {
    const result = await soilService.createSoilReport(
      req.supabase,
      req.user.id,
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Soil health analysis completed successfully",
      data: result,
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

export const getSoilReports = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 20;
    const offset = parseInt(req.query.offset, 10) || 0;

    const result = await soilService.getSoilReports(req.supabase, req.user.id, {
      limit,
      offset,
    });

    res.json({
      success: true,
      message: "Soil reports retrieved successfully",
      data: result,
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

export const getSoilReportById = async (req, res, next) => {
  try {
    const result = await soilService.getSoilReportById(
      req.supabase,
      req.user.id,
      req.params.id
    );

    res.json({
      success: true,
      message: "Soil report details retrieved",
      data: result,
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteSoilReport = async (req, res, next) => {
  try {
    await soilService.deleteSoilReport(req.supabase, req.user.id, req.params.id);

    res.json({
      success: true,
      message: "Soil report deleted successfully",
      data: null,
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

