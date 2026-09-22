import { ai } from '../config/gemini.js';
import { AppError } from '../utils/AppError.js';
import { buildGenerationConfig } from '../utils/generationConfig.js';
import { extractOutputText, validateMemoryOptions } from '../utils/interactionHelper.js';

export const generateText = async (prompt, config = {}) => {
  try {
    const interactionPayload = buildGenerationConfig(config);
    validateMemoryOptions(interactionPayload);

    const interaction = await ai.interactions.create({
      ...interactionPayload,
      input: prompt,
    });

    const text = extractOutputText(interaction);

    return { text, interactionId: interaction.id ?? null };
  } catch (error) {
    if (error instanceof AppError) throw error;
    console.error('Text generation failed:', error);
    throw new AppError('Failed to process text generation.', 500, 'GEMINI_ERROR');
  }
};
