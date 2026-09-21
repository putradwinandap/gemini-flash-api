import { z } from 'zod';

export const generateFromImageSchema = z.object({
  body: z.object({
    prompt: z.string().optional(),
  }),
});
