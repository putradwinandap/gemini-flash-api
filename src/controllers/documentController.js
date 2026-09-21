import fs from 'fs/promises';
import * as documentService from '../services/documentService.js';
import { sendSuccess } from '../utils/responseHelper.js';
import { AppError } from '../utils/AppError.js';

export const handleGenerateFromDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new AppError('Document file is required', 400, 'BAD_REQUEST');
    }

    const { prompt } = req.body || {};
    const generatedText = await documentService.generateFromDocument({
      documentPath: req.file.path,
      mimeType: req.file.mimetype,
      prompt,
    });

    return sendSuccess(
      res,
      200,
      { text: generatedText },
      'Document generated successfully'
    );
  } catch (error) {
    next(error);
  } finally {
    if (req.file && req.file.path) {
      try {
        await fs.unlink(req.file.path);
      } catch (cleanupError) {
        console.error(`Failed to delete temporary file ${req.file.path}:`, cleanupError);
      }
    }
  }
};
