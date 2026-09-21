import { sendError } from '../utils/responseHelper.js';

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const code = err.code || 'INTERNAL_ERROR';
  const message = err.message || 'An unexpected error occurred';

  return sendError(res, statusCode, message, code);
};
