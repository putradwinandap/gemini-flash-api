import { AppError } from '../utils/AppError.js';

export const validateRequest = (schema) => {
  return async (req, res, next) => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      if (parsed.body) req.body = parsed.body;
      if (parsed.query) req.query = parsed.query;
      if (parsed.params) req.params = parsed.params;

      next();
    } catch (error) {
      if (error.name === 'ZodError' || error.issues) {
        const message = error.issues
          ? error.issues.map((issue) => issue.message).join(', ')
          : error.message;
        return next(new AppError(message, 400, 'VALIDATION_ERROR'));
      }
      next(error);
    }
  };
};
