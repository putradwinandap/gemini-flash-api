import { Router } from 'express';
import { handleGenerateText } from '../controllers/textController.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { generateTextSchema } from '../schemas/textSchema.js';

const router = Router();

router.post('/generate-text', validateRequest(generateTextSchema), handleGenerateText);

export default router;
