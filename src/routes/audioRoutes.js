import { Router } from 'express';
import { handleGenerateFromAudio } from '../controllers/audioController.js';
import { uploadAudio } from '../middlewares/uploadMiddleware.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { generateFromAudioSchema } from '../schemas/audioSchema.js';
import { AppError } from '../utils/AppError.js';

const router = Router();

export const audioUploadHandler = (req, res, next) => {
  uploadAudio.fields([
    { name: 'audio', maxCount: 1 },
    { name: 'file', maxCount: 1 },
  ])(req, res, (err) => {
    if (err) return next(err);
    const audioFile = req.files?.audio?.[0];
    const genericFile = req.files?.file?.[0];

    if (audioFile && genericFile) {
      return next(new AppError('Send only one audio file', 400, 'VALIDATION_ERROR'));
    }

    req.file = audioFile || genericFile;
    return next();
  });
};

router.post(
  '/generate-from-audio',
  audioUploadHandler,
  validateRequest(generateFromAudioSchema),
  handleGenerateFromAudio
);

export default router;
