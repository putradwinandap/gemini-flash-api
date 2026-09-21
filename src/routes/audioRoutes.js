import { Router } from 'express';
import { handleGenerateFromAudio } from '../controllers/audioController.js';
import { uploadAudio } from '../middlewares/uploadMiddleware.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { generateFromAudioSchema } from '../schemas/audioSchema.js';

const router = Router();

const audioUploadHandler = (req, res, next) => {
  uploadAudio.single('audio')(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return uploadAudio.single('file')(req, res, next);
      }
      return next(err);
    }
    if (!req.file) {
      return uploadAudio.single('file')(req, res, next);
    }
    next();
  });
};

router.post(
  '/generate-from-audio',
  audioUploadHandler,
  validateRequest(generateFromAudioSchema),
  handleGenerateFromAudio
);

export default router;
