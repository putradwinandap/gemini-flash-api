import { Router } from 'express';
import { handleGenerateFromDocument } from '../controllers/documentController.js';
import { uploadDocument } from '../middlewares/uploadMiddleware.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { generateFromDocumentSchema } from '../schemas/documentSchema.js';

const router = Router();

const documentUploadHandler = (req, res, next) => {
  uploadDocument.single('document')(req, res, (err) => {
    if (err) return next(err);
    if (!req.file) {
      return uploadDocument.single('file')(req, res, next);
    }
    next();
  });
};

router.post(
  '/generate-from-document',
  documentUploadHandler,
  validateRequest(generateFromDocumentSchema),
  handleGenerateFromDocument
);

export default router;
