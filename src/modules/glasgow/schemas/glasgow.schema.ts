import { z } from 'zod';

export const GlasgowSchema = z.object({
  eyeOpening: z.number().int().min(1).max(4) as z.ZodType<1 | 2 | 3 | 4>,
  verbalResponse: z.number().int().min(1).max(5) as z.ZodType<1 | 2 | 3 | 4 | 5>,
  motorResponse: z.number().int().min(1).max(6) as z.ZodType<1 | 2 | 3 | 4 | 5 | 6>,
  pupillaryReactivity: z.number().int().min(0).max(2).optional() as z.ZodType<0 | 1 | 2 | undefined>,
});
