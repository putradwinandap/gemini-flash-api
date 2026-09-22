import { generateFromMedia } from '../utils/multimodalHelper.js';

export const generateFromAudio = async ({ audioPath, mimeType, prompt }, config = {}) => {
  return generateFromMedia({
    filePath: audioPath,
    mimeType: mimeType || 'audio/mp3',
    mediaType: 'audio',
    prompt,
    defaultPrompt: 'Tolong berikan transkripsi dan analisis lengkap dari file audio ini.',
    errorContext: 'audio generation',
    config,
  });
};
