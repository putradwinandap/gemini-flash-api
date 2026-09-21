import { z } from 'zod';

export const generateFromAudioSchema = z.object({
  body: z.object({
    prompt: z.string().optional(),
  }),
});
