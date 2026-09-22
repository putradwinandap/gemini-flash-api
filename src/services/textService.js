import { ai } from '../config/gemini.js';
import { AppError } from '../utils/AppError.js';
import { buildGenerationConfig } from '../utils/generationConfig.js';
import { extractOutputText, validateMemoryOptions } from '../utils/interactionHelper.js';
import { isAbortError } from '../utils/abort.js';
import { createRequestContext } from '../utils/requestContext.js';

export const generateText = async (prompt, config = {}) => {
  const requestContext = createRequestContext(config);
  try {
    const interactionPayload = buildGenerationConfig(config);
    validateMemoryOptions(interactionPayload);

    const interaction = await ai.interactions.create({
      ...interactionPayload,
      input: prompt,
      config: { abortSignal: requestContext.signal },
    });

    const text = extractOutputText(interaction);

    return { text, interactionId: interaction.id ?? null };
  } catch (error) {
    if (requestContext.timedOut && isAbortError(error)) {
      throw new AppError('The request timed out', 504, 'TIMEOUT');
    }
    if (error instanceof AppError || isAbortError(error)) throw error;
    console.error('Text generation failed:', error);
    throw new AppError('Failed to process text generation.', 500, 'GEMINI_ERROR');
  } finally {
    requestContext.cleanup();
  }
};
