import { fertilizerService } from "../services/fertilizer.service.js";

export const recommendFertilizer = async (req, res, next) => {
  try {
    const result = await fertilizerService.createFertilizerAdvisory(
      req.supabase,
      req.user.id,
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Fertilizer advisory generated successfully",
      data: result,
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

export const getFertilizerAdvisories = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 20;
    const offset = parseInt(req.query.offset, 10) || 0;

    const result = await fertilizerService.getFertilizerAdvisories(
      req.supabase,
      req.user.id,
      { limit, offset }
    );

    res.json({
      success: true,
      message: "Fertilizer advisories retrieved successfully",
      data: result,
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

export const getFertilizerAdvisoryById = async (req, res, next) => {
  try {
    const result = await fertilizerService.getFertilizerAdvisoryById(
      req.supabase,
      req.user.id,
      req.params.id
    );

    res.json({
      success: true,
      message: "Fertilizer advisory report retrieved",
      data: result,
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteFertilizerAdvisory = async (req, res, next) => {
  try {
    await fertilizerService.deleteFertilizerAdvisory(
      req.supabase,
      req.user.id,
      req.params.id
    );

    res.json({
      success: true,
      message: "Fertilizer advisory deleted successfully",
      data: null,
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

