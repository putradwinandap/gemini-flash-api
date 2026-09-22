import fs from 'fs/promises';
import { ai } from '../config/gemini.js';
import { AppError } from '../utils/AppError.js';
import { buildGenerationConfig } from '../utils/generationConfig.js';

export const generateFromImage = async ({ imagePath, mimeType, prompt }, config = {}) => {
  try {
    const fileBuffer = await fs.readFile(imagePath);
    const base64Data = fileBuffer.toString('base64');

    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: mimeType || 'image/jpeg',
      },
    };

    const contents = prompt ? [prompt, imagePart] : [imagePart];
    const generationPayload = buildGenerationConfig(config);

    const response = await ai.models.generateContent({
      ...generationPayload,
      contents,
    });

    if (!response || !response.text) {
      throw new Error('Empty response received from Gemini model');
    }

    return response.text;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      `Failed to generate text from image using Gemini API: ${error.message}`,
      500,
      'GEMINI_ERROR'
    );
  }
};
