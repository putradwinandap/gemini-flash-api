import { Router } from 'express';
import { handleGenerateFromDocument } from '../controllers/documentController.js';
import { uploadDocument } from '../middlewares/uploadMiddleware.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { generateFromDocumentSchema } from '../schemas/documentSchema.js';
import { AppError } from '../utils/AppError.js';
import { validateFileSignature } from '../middlewares/validateFileSignature.js';

const router = Router();

export const documentUploadHandler = (req, res, next) => {
  uploadDocument.fields([
    { name: 'document', maxCount: 1 },
    { name: 'file', maxCount: 1 },
  ])(req, res, (err) => {
    if (err) return next(err);
    const documentFile = req.files?.document?.[0];
    const genericFile = req.files?.file?.[0];

    if (documentFile && genericFile) {
      return next(new AppError('Send only one document file', 400, 'VALIDATION_ERROR'));
    }

    req.file = documentFile || genericFile;
    return next();
  });
};

router.post(
  '/generate-from-document',
  documentUploadHandler,
  validateFileSignature('document'),
  validateRequest(generateFromDocumentSchema),
  handleGenerateFromDocument
);

export default router;
