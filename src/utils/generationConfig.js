import { GEMINI_MODEL } from '../config/gemini.js';

/**
 * Builds a clean generation config payload to pass to `ai.models.generateContent()`.
 *
 * Supported options (all optional):
 *  - model            {string}   Override the Gemini model name.
 *  - temperature      {number}   Controls randomness (0.0 – 2.0).
 *  - maxOutputTokens  {number}   Maximum tokens to generate.
 *  - topP             {number}   Nucleus sampling threshold (0.0 – 1.0).
 *  - topK             {number}   Top-K sampling value.
 *  - systemInstruction {string}  System-level instruction prepended to every request.
 *  - stopSequences    {string[]} List of stop sequences.
 *
 * @param {object} [config={}] - User-supplied config options.
 * @returns {{ model: string, config: object }} - Ready-to-spread payload.
 */
export const buildGenerationConfig = (config = {}) => {
  const {
    model,
    temperature,
    maxOutputTokens,
    topP,
    topK,
    systemInstruction,
    stopSequences,
  } = config;

  const resolvedModel = model || GEMINI_MODEL;

  const generationConfig = {};

  if (temperature !== undefined) generationConfig.temperature = temperature;
  if (maxOutputTokens !== undefined) generationConfig.maxOutputTokens = maxOutputTokens;
  if (topP !== undefined) generationConfig.topP = topP;
  if (topK !== undefined) generationConfig.topK = topK;
  if (stopSequences !== undefined) generationConfig.stopSequences = stopSequences;

  const payload = { model: resolvedModel };

  if (Object.keys(generationConfig).length > 0) {
    payload.config = generationConfig;
  }

  if (systemInstruction) {
    payload.config = { ...payload.config, systemInstruction };
  }

  return payload;
};
