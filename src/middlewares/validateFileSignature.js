import { AppError } from '../utils/AppError.js';
import { hasValidFileSignature } from '../utils/fileSignature.js';

export const validateFileSignature = (kind) => async (req, _res, next) => {
  if (!req.file) return next();
  try {
    if (!(await hasValidFileSignature(req.file, kind))) {
      return next(
        new AppError('File content does not match its declared type', 400, 'VALIDATION_ERROR')
      );
    }
    return next();
  } catch (error) {
    return next(error);
  }
};
