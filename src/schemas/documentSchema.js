import { z } from 'zod';

export const generateFromDocumentSchema = z.object({
  body: z.object({
    prompt: z.string().optional(),
  }),
});
