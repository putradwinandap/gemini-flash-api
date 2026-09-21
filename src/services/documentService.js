import fs from 'fs/promises';
import { ai, GEMINI_MODEL } from '../config/gemini.js';
import { AppError } from '../utils/AppError.js';

export const generateFromDocument = async ({ documentPath, mimeType, prompt }) => {
  try {
    const fileBuffer = await fs.readFile(documentPath);
    const base64Data = fileBuffer.toString('base64');

    const documentPart = {
      inlineData: {
        data: base64Data,
        mimeType: mimeType || 'application/pdf',
      },
    };

    const promptText = prompt && prompt.trim() !== '' 
      ? prompt 
      : 'Tolong berikan ringkasan dan analisis lengkap dari dokumen ini.';

    const contents = [promptText, documentPart];

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
      `Failed to generate text from document using Gemini API: ${error.message}`,
      500,
      'GEMINI_ERROR'
    );
  }
};
