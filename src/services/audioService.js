import fs from 'fs/promises';
import { ai, GEMINI_MODEL } from '../config/gemini.js';
import { AppError } from '../utils/AppError.js';

export const generateFromAudio = async ({ audioPath, mimeType, prompt }) => {
  try {
    const fileBuffer = await fs.readFile(audioPath);
    const base64Data = fileBuffer.toString('base64');

    const audioPart = {
      inlineData: {
        data: base64Data,
        mimeType: mimeType || 'audio/mp3',
      },
    };

    const promptText =
      prompt && prompt.trim() !== ''
        ? prompt
        : 'Tolong berikan transkripsi dan analisis lengkap dari file audio ini.';

    const contents = [promptText, audioPart];

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents,
    });

    if (!response || !response.text) {
      throw new Error('Empty response received from Gemini model');
    }

    return response.text;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      `Failed to generate text from audio using Gemini API: ${error.message}`,
      500,
      'GEMINI_ERROR'
    );
  }
};
