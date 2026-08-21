import { z } from 'zod';

export const GasometriaSchema = z.object({
  ph: z.number().min(6.5, 'pH mínimo é 6.5').max(7.8, 'pH máximo é 7.8'),
  paco2: z.number().min(10, 'PaCO2 mínima é 10 mmHg').max(150, 'PaCO2 máxima é 150 mmHg'),
  hco3: z.number().min(2, 'HCO3 mínimo é 2 mEq/L').max(60, 'HCO3 máximo é 60 mEq/L'),
  pao2: z.number().min(10, 'PaO2 mínima é 10 mmHg').max(600, 'PaO2 máxima é 600 mmHg'),
  fio2: z.number().min(21, 'FiO2 mínima é 21%').max(100, 'FiO2 máxima é 100%'),
  be: z.number().min(-30).max(30).optional(),
});
