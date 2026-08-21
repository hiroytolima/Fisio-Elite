import { z } from 'zod';

export const HacorSchema = z.object({
  hr: z.number().min(20, 'FC mínima é 20 bpm').max(300, 'FC máxima é 300 bpm'),
  ph: z.number().min(6.5, 'pH mínimo plausível é 6.5').max(7.8, 'pH máximo é 7.8'),
  gcs: z.number().int().min(3, 'Glasgow mínimo é 3').max(15, 'Glasgow máximo é 15'),
  pao2Fio2: z.number().min(1, 'PaO2/FiO2 mínima é 1').max(1000, 'PaO2/FiO2 máxima é 1000'),
  rr: z.number().int().min(4, 'FR mínima é 4 irpm').max(80, 'FR máxima é 80 irpm'),
});
