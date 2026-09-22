import { Router } from 'express';
import { handleGenerateFromImage } from '../controllers/imageController.js';
import { uploadImage } from '../middlewares/uploadMiddleware.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { generateFromImageSchema } from '../schemas/imageSchema.js';
import { validateFileSignature } from '../middlewares/validateFileSignature.js';

const router = Router();

router.post(
  '/generate-from-image',
  uploadImage.single('image'),
  validateFileSignature('image'),
  validateRequest(generateFromImageSchema),
  handleGenerateFromImage
);

export default router;
