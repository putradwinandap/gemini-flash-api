import * as imageService from '../services/imageService.js';
import { sendSuccess } from '../utils/responseHelper.js';
import { AppError } from '../utils/AppError.js';
import { cleanupUploadedFiles } from '../utils/uploadCleanup.js';
import { isAbortError } from '../utils/abort.js';

export const handleGenerateFromImage = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new AppError('Image file is required', 400, 'BAD_REQUEST');
    }

    const { prompt, previousInteractionId } = req.body || {};
    const { text, interactionId } = await imageService.generateFromImage(
      {
        imagePath: req.file.path,
        mimeType: req.file.mimetype,
        prompt,
      },
      { previousInteractionId, signal: req.clientAbortSignal }
    );

    return sendSuccess(res, 200, { text, interactionId }, 'Text generated from image successfully');
  } catch (error) {
    if (req.clientAbortSignal?.aborted || isAbortError(error)) return undefined;
    return next(error);
  } finally {
    await cleanupUploadedFiles(req);
  }
};
