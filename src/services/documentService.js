import { generateFromMedia } from '../utils/multimodalHelper.js';

export const generateFromDocument = async ({ documentPath, mimeType, prompt }, config = {}) => {
  return generateFromMedia({
    filePath: documentPath,
    mimeType: mimeType || 'application/pdf',
    mediaType: 'document',
    prompt,
    defaultPrompt: 'Tolong berikan ringkasan dan analisis lengkap dari dokumen ini.',
    errorContext: 'document generation',
    config,
  });
};
