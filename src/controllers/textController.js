import * as textService from '../services/textService.js';
import { sendSuccess } from '../utils/responseHelper.js';

export const handleGenerateText = async (req, res, next) => {
  try {
    const { prompt } = req.body;
    const generatedText = await textService.generateText(prompt);

    return sendSuccess(
      res,
      200,
      { text: generatedText },
      'Text generated successfully'
    );
  } catch (error) {
    next(error);
  }
};
