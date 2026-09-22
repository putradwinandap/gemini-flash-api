import * as documentService from '../services/documentService.js';
import { sendSuccess } from '../utils/responseHelper.js';
import { AppError } from '../utils/AppError.js';
import { cleanupUploadedFiles } from '../utils/uploadCleanup.js';

export const handleGenerateFromDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new AppError('Document file is required', 400, 'BAD_REQUEST');
    }

    const { prompt, previousInteractionId } = req.body || {};
    const { text, interactionId } = await documentService.generateFromDocument(
      {
        documentPath: req.file.path,
        mimeType: req.file.mimetype,
        prompt,
      },
      { previousInteractionId }
    );

    return sendSuccess(res, 200, { text, interactionId }, 'Document generated successfully');
  } catch (error) {
    return next(error);
  } finally {
    await cleanupUploadedFiles(req);
  }
};
