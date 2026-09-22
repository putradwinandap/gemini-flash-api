import * as textService from '../services/textService.js';
import { sendSuccess } from '../utils/responseHelper.js';
import { isAbortError } from '../utils/abort.js';

export const handleGenerateText = async (req, res, next) => {
  try {
    const { prompt, previousInteractionId } = req.body;
    const { text, interactionId } = await textService.generateText(prompt, {
      previousInteractionId,
      signal: req.clientAbortSignal,
    });

    return sendSuccess(res, 200, { text, interactionId }, 'Text generated successfully');
  } catch (error) {
    if (req.clientAbortSignal?.aborted || isAbortError(error)) return undefined;
    return next(error);
  }
};
