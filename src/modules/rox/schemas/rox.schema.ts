import { z } from 'zod';

export const RoxSchema = z.object({
  spo2: z
    .number()
    .min(50, 'SpO2 mínima plausível é 50%')
    .max(100, 'SpO2 máxima é 100%'),
  fio2: z
    .number()
    .min(21, 'FiO2 mínima é 21% (ar ambiente)')
    .max(100, 'FiO2 máxima é 100%'),
  rr: z
    .number()
    .int()
    .min(4, 'FR mínima plausível é 4 irpm')
    .max(80, 'FR máxima plausível é 80 irpm'),
});
