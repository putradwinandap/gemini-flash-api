import { z } from 'zod';

export const generateTextSchema = z.object({
  body: z.object({
    prompt: z
      .string({
        required_error: 'Prompt parameter is required',
        invalid_type_error: 'Prompt must be a string',
      })
      .min(1, 'Prompt cannot be empty'),
  }),
});
