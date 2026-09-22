import * as textService from '../services/textService.js';
import { sendSuccess } from '../utils/responseHelper.js';

export const handleGenerateText = async (req, res, next) => {
  try {
    const { prompt, previousInteractionId } = req.body;
    const { text, interactionId } = await textService.generateText(prompt, {
      previousInteractionId,
    });

    return sendSuccess(res, 200, { text, interactionId }, 'Text generated successfully');
  } catch (error) {
    return next(error);
  }
};
