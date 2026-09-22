import fs from 'fs/promises';
import { ai } from '../config/gemini.js';
import { AppError } from './AppError.js';
import { buildGenerationConfig } from './generationConfig.js';
import { extractOutputText, validateMemoryOptions } from './interactionHelper.js';

export const generateFromMedia = async ({
  filePath,
  mimeType,
  mediaType,
  prompt,
  defaultPrompt,
  errorContext,
  config = {},
}) => {
  try {
    const fileBuffer = await fs.readFile(filePath);
    const interactionPayload = buildGenerationConfig(config);
    validateMemoryOptions(interactionPayload);

    const promptText = prompt?.trim() ? prompt : defaultPrompt;
    const interaction = await ai.interactions.create({
      ...interactionPayload,
      input: [
        { type: 'text', text: promptText },
        {
          type: mediaType,
          data: fileBuffer.toString('base64'),
          mime_type: mimeType,
        },
      ],
    });

    return {
      text: extractOutputText(interaction),
      interactionId: interaction.id ?? null,
    };
  } catch (error) {
    if (error instanceof AppError) throw error;

    console.error(`${errorContext} failed:`, error);
    throw new AppError(`Failed to process ${errorContext}.`, 500, 'GEMINI_ERROR');
  }
};
