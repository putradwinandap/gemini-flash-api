import 'dotenv/config';
import app from './app.js';
import * as textService from './services/textService.js';
import * as imageService from './services/imageService.js';
import * as documentService from './services/documentService.js';
import * as audioService from './services/audioService.js';
import { ai, GEMINI_MODEL, GEMINI_STORE, GEMINI_TIMEOUT_MS } from './config/gemini.js';
import { AppError } from './utils/AppError.js';

export {
  app,
  ai,
  GEMINI_MODEL,
  GEMINI_STORE,
  GEMINI_TIMEOUT_MS,
  AppError,
  textService,
  imageService,
  documentService,
  audioService,
};

export { generateText } from './services/textService.js';
export { generateFromImage } from './services/imageService.js';
export { generateFromDocument } from './services/documentService.js';
export { generateFromAudio } from './services/audioService.js';
