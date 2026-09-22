import { GEMINI_MODEL, GEMINI_STORE } from '../config/gemini.js';

/**
 * Builds a clean Interactions API payload to pass to `ai.interactions.create()`.
 *
 * Supported options (all optional):
 *  - model            {string}   Override the Gemini model name.
 *  - temperature      {number}   Controls randomness (0.0 – 2.0).
 *  - maxOutputTokens  {number}   Maximum tokens to generate.
 *  - topP             {number}   Nucleus sampling threshold (0.0 – 1.0).
 *  - topK             {number}   Top-K sampling value.
 *  - systemInstruction {string}  System-level instruction (top-level `system_instruction`).
 *  - stopSequences    {string[]} List of stop sequences.
 *  - store            {boolean}  ONLY via code config or GEMINI_STORE env. Never via endpoint.
 *  - previousInteractionId / previous_interaction_id {string} Chained memory pointer.
 *
 * Priority for `store`: code config > GEMINI_STORE env.
 *
 * @param {object} [config={}] - User-supplied config options.
 * @returns {{ model: string, generation_config: object, system_instruction?: string, store?: boolean, previous_interaction_id?: string }}
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
    store,
    previousInteractionId,
    previous_interaction_id,
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
    payload.generation_config = generationConfig;
  }

  if (systemInstruction) {
    payload.system_instruction = systemInstruction;
  }

  // Memory: code config wins, otherwise ENV default.
  if (store !== undefined) {
    payload.store = store;
  } else {
    payload.store = GEMINI_STORE;
  }

  const chainedId = previousInteractionId || previous_interaction_id;
  if (chainedId) {
    payload.previous_interaction_id = chainedId;
  }

  return payload;
};
