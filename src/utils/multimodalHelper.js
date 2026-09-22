import fs from 'fs/promises';
import { ai } from '../config/gemini.js';
import { AppError } from './AppError.js';
import { buildGenerationConfig } from './generationConfig.js';
import { extractOutputText, validateMemoryOptions } from './interactionHelper.js';
import { isAbortError } from './abort.js';
import { createRequestContext } from './requestContext.js';

export const generateFromMedia = async ({
  filePath,
  mimeType,
  mediaType,
  prompt,
  defaultPrompt,
  errorContext,
  config = {},
}) => {
  const requestContext = createRequestContext(config);
  try {
    if (requestContext.signal.aborted) {
      const error = new Error('The request was aborted');
      error.name = 'AbortError';
      throw error;
    }
    const fileBuffer = await fs.readFile(filePath, { signal: requestContext.signal });
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
      config: { abortSignal: requestContext.signal },
    });

    return {
      text: extractOutputText(interaction),
      interactionId: interaction.id ?? null,
    };
  } catch (error) {
    if (requestContext.timedOut && isAbortError(error)) {
      throw new AppError('The request timed out', 504, 'TIMEOUT');
    }
    if (error instanceof AppError || isAbortError(error)) throw error;

    console.error(`${errorContext} failed:`, error);
    throw new AppError(`Failed to process ${errorContext}.`, 500, 'GEMINI_ERROR');
  } finally {
    requestContext.cleanup();
  }
};
