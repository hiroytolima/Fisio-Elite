import { z } from 'zod';

export const RassSchema = z.object({
  score: z.number().int().min(-5, 'Escore mínimo é -5').max(4, 'Escore máximo é +4'),
});
