import { AppError } from './AppError.js';

/**
 * Extracts plain text from an Interactions API response.
 * Prefers the SDK `output_text` sugar, falls back to manual `steps` scan.
 *
 * @param {object} interaction - Result of `ai.interactions.create()`.
 * @returns {string} - Joined model text.
 * @throws {Error} - When no text content is present.
 */
export const extractOutputText = (interaction) => {
  if (!interaction) {
    throw new Error('Empty response received from Gemini model');
  }

  if (typeof interaction.output_text === 'string' && interaction.output_text.trim() !== '') {
    return interaction.output_text;
  }

  const steps = Array.isArray(interaction.steps) ? interaction.steps : [];
  const texts = [];

  for (const step of steps) {
    if (!step || step.type !== 'model_output' || !Array.isArray(step.content)) continue;
    for (const part of step.content) {
      if (part && part.type === 'text' && typeof part.text === 'string' && part.text !== '') {
        texts.push(part.text);
      }
    }
  }

  if (texts.length === 0) {
    throw new Error('Empty response received from Gemini model');
  }

  return texts.join('');
};

/**
 * Validates chained-memory usage before calling the Interactions API.
 *
 * Rule: `previous_interaction_id` requires stored memory (`store: true`).
 * `store` itself comes ONLY from code config or GEMINI_STORE env, never endpoint.
 *
 * @param {object} payload - Interactions payload containing store/previous_interaction_id.
 * @throws {AppError} - 400 when chaining without stored memory.
 */
export const validateMemoryOptions = (payload = {}) => {
  if (payload.previous_interaction_id && payload.store === false) {
    throw new AppError(
      'previousInteractionId requires stored memory (store=true). Enable GEMINI_STORE or pass { store: true } via code config.',
      400,
      'BAD_REQUEST'
    );
  }
};
