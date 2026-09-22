import { z } from 'zod';

export const generateFromImageSchema = z.object({
  body: z
    .object({
      prompt: z.string().max(10000).optional(),
      previousInteractionId: z.string().max(200).optional(),
    })
    .strict(),
});
