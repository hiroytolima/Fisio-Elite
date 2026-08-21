import { z } from 'zod';

export const SofaSchema = z.object({
  pao2Fio2: z.number().min(1, 'PaO2/FiO2 deve ser maior que 0').max(1000, 'Valor implausível (> 1000)'),
  platelets: z.number().min(0, 'Plaquetas não podem ser negativas').max(2000, 'Valor implausível'),
  bilirubin: z.number().min(0, 'Bilirrubina não pode ser negativa').max(100, 'Valor implausível'),
  map: z.number().min(0, 'PAM não pode ser negativa').max(300, 'Valor implausível'),
  vasopressors: z.enum([
    'none',
    'dobutamine',
    'dopamine_low',
    'dopamine_med',
    'dopamine_high',
    'norepinephrine_low',
    'norepinephrine_high',
  ]),
  glasgow: z.number().int().min(3, 'Glasgow mínimo é 3').max(15, 'Glasgow máximo é 15'),
  creatinine: z.number().min(0, 'Creatinina não pode ser negativa').max(30, 'Valor implausível'),
  urineOutput: z.number().min(0, 'Débito urinário não pode ser negativo').max(10000, 'Valor implausível'),
});
