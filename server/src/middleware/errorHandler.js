/**
 * Centralized Express Error Handling Middleware.
 * Adheres strictly to the API Response standard:
 * {
 *   success: false,
 *   message: "...",
 *   data: null,
 *   error: {
 *     code: "...",
 *     details: ...
 *   }
 * }
 */
export const errorHandler = (err, req, res, next) => {
  // If response has already started streaming, delegate to default Express handler
  if (res.headersSent) {
    return next(err);
  }

  console.error("Unhandled Application Error:", {
    path: req.originalUrl,
    method: req.method,
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });

  // Handle Multer upload errors
  if (err.name === "MulterError") {
    return res.status(400).json({
      success: false,
      message: err.message || "File upload error",
      data: null,
      error: {
        code: "UPLOAD_ERROR",
        details: err.code,
      },
    });
  }

  const statusCode = err.statusCode || (res.statusCode >= 400 ? res.statusCode : 500);

  res.status(statusCode).json({
    success: false,
    message: err.message || "An unexpected error occurred while processing your request",
    data: null,
    error: {
      code: err.code || "INTERNAL_SERVER_ERROR",
      details: err.details || (process.env.NODE_ENV === "development" ? err.stack : null),
    },
  });
};

