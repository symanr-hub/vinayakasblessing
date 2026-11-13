import { farmService } from "../services/farm.service.js";

export const createFarm = async (req, res, next) => {
  try {
    const farm = await farmService.createFarm(req.supabase, req.user.id, req.body);
    res.status(201).json({
      success: true,
      message: "Farm plot registered successfully",
      data: farm,
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

export const getFarms = async (req, res, next) => {
  try {
    const farms = await farmService.getFarms(req.supabase, req.user.id);
    res.json({
      success: true,
      message: "Farms retrieved successfully",
      data: farms,
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

export const getFarmById = async (req, res, next) => {
  try {
    const farm = await farmService.getFarmById(req.supabase, req.user.id, req.params.id);
    res.json({
      success: true,
      message: "Farm details retrieved",
      data: farm,
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

export const updateFarm = async (req, res, next) => {
  try {
    const farm = await farmService.updateFarm(req.supabase, req.user.id, req.params.id, req.body);
    res.json({
      success: true,
      message: "Farm plot updated successfully",
      data: farm,
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteFarm = async (req, res, next) => {
  try {
    await farmService.deleteFarm(req.supabase, req.user.id, req.params.id);
    res.json({
      success: true,
      message: "Farm plot deleted successfully",
      data: null,
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

