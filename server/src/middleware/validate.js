/**
 * Zod Request Validation Middleware:
 * Validates request body, query params, or route params.
 * Replaces req[target] with parsed and coerced types on success.
 * Returns structured validation errors on failure.
 *
 * @param {import('zod').ZodSchema} schema
 * @param {'body' | 'query' | 'params'} target
 */
export const validate = (schema, target = "body") => {
  return (req, res, next) => {
    try {
      const result = schema.safeParse(req[target]);

      if (!result.success) {
        const errorDetails = result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
          code: issue.code,
        }));

        return res.status(400).json({
          success: false,
          message: "Request validation failed",
          data: null,
          error: {
            code: "VALIDATION_ERROR",
            details: errorDetails,
          },
        });
      }

      // Replace target data with parsed sanitized data
      req[target] = result.data;
      next();
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Internal schema validation failure",
        data: null,
        error: {
          code: "SCHEMA_ERROR",
          details: err.message,
        },
      });
    }
  };
};

