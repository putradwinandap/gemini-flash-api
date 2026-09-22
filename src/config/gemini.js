import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';

export const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite';

// Memory control: ONLY via ENV or code config. Never via endpoint request body.
export const GEMINI_STORE = process.env.GEMINI_STORE !== 'false';

export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});
