import { diseaseService } from "../services/disease.service.js";

export const analyzeDisease = async (req, res, next) => {
  try {
    // When using multipart/form-data with multer, req.body fields are strings
    // Parse any JSON or formatted fields if necessary
    const inputData = {
      farmId: req.body.farmId || null,
      cropName: req.body.cropName,
      affectedPlantPart: req.body.affectedPlantPart,
      symptoms: req.body.symptoms,
      duration: req.body.duration,
      visibleDamage: req.body.visibleDamage || null,
      weatherCondition: req.body.weatherCondition || null,
      language: req.body.language || "en",
    };

    const result = await diseaseService.createDiseaseReport(
      req.supabase,
      req.user.id,
      inputData,
      req.file || null
    );

    res.status(201).json({
      success: true,
      message: "Crop disease and pest analysis completed successfully",
      data: result,
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

export const getDiseaseReports = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 20;
    const offset = parseInt(req.query.offset, 10) || 0;

    const result = await diseaseService.getDiseaseReports(
      req.supabase,
      req.user.id,
      { limit, offset }
    );

    res.json({
      success: true,
      message: "Disease reports retrieved successfully",
      data: result,
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

export const getDiseaseReportById = async (req, res, next) => {
  try {
    const result = await diseaseService.getDiseaseReportById(
      req.supabase,
      req.user.id,
      req.params.id
    );

    res.json({
      success: true,
      message: "Disease report details retrieved",
      data: result,
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteDiseaseReport = async (req, res, next) => {
  try {
    await diseaseService.deleteDiseaseReport(
      req.supabase,
      req.user.id,
      req.params.id
    );

    res.json({
      success: true,
      message: "Disease report deleted successfully",
      data: null,
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

