import { sendError } from '../utils/responseHelper.js';
import { cleanupUploadedFiles } from '../utils/uploadCleanup.js';

export const errorHandler = async (err, req, res, _next) => {
  await cleanupUploadedFiles(req);

  const isMulterError = err.name === 'MulterError';
  const statusCode = isMulterError ? 400 : err.statusCode || 500;
  const code = isMulterError ? 'VALIDATION_ERROR' : err.code || 'INTERNAL_ERROR';
  const isProduction = process.env.NODE_ENV === 'production';
  const message =
    isProduction && statusCode >= 500
      ? 'An unexpected server error occurred'
      : err.message || 'An unexpected error occurred';

  if (statusCode >= 500) console.error(err);

  return sendError(res, statusCode, message, code);
};
