import fs from 'fs/promises';
import * as imageService from '../services/imageService.js';
import { sendSuccess } from '../utils/responseHelper.js';
import { AppError } from '../utils/AppError.js';

export const handleGenerateFromImage = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new AppError('Image file is required', 400, 'BAD_REQUEST');
    }

    const { prompt } = req.body || {};
    const generatedText = await imageService.generateFromImage({
      imagePath: req.file.path,
      mimeType: req.file.mimetype,
      prompt,
    });

    return sendSuccess(
      res,
      200,
      { text: generatedText },
      'Text generated from image successfully'
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
