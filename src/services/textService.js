import { ai } from '../config/gemini.js';
import { AppError } from '../utils/AppError.js';
import { buildGenerationConfig } from '../utils/generationConfig.js';

export const generateText = async (prompt, config = {}) => {
  try {
    const generationPayload = buildGenerationConfig(config);

    const response = await ai.models.generateContent({
      ...generationPayload,
      contents: prompt,
    });

    if (!response || !response.text) {
      throw new Error('Empty response received from Gemini model');
    }

    return response.text;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      `Failed to generate text from Gemini API: ${error.message}`,
      500,
      'GEMINI_ERROR'
    );
  }
};
