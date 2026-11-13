import { supabaseAdmin, createUserClient } from "../config/supabase.js";

/**
 * Authentication Middleware:
 * Verifies the Supabase JWT Bearer token on incoming requests.
 * Attaches the authenticated user object and a user-scoped Supabase client
 * that automatically enforces Row Level Security (RLS) in PostgreSQL.
 */
export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Bearer token missing.",
        data: null,
        error: {
          code: "UNAUTHORIZED",
          details: "Missing or invalid Authorization header",
        },
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Invalid token format",
        data: null,
        error: {
          code: "UNAUTHORIZED",
          details: "Token string is empty",
        },
      });
    }

    // Verify token with Supabase Auth
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        success: false,
        message: "Session expired or invalid authentication token",
        data: null,
        error: {
          code: "UNAUTHORIZED",
          details: error ? error.message : "User not found",
        },
      });
    }

    // Attach authenticated user and user-scoped Supabase client with RLS active
    req.user = user;
    req.token = token;
    req.supabase = createUserClient(token);

    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal authentication verification error",
      data: null,
      error: {
        code: "INTERNAL_AUTH_ERROR",
        details: err.message,
      },
    });
  }
};

