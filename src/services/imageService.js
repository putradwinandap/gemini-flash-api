import { generateFromMedia } from '../utils/multimodalHelper.js';

export const generateFromImage = async ({ imagePath, mimeType, prompt }, config = {}) => {
  return generateFromMedia({
    filePath: imagePath,
    mimeType: mimeType || 'image/jpeg',
    mediaType: 'image',
    prompt,
    defaultPrompt: 'Describe what you see in this image in detail.',
    errorContext: 'image generation',
    config,
  });
};
