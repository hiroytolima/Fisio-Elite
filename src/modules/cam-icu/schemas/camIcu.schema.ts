import { z } from 'zod';

export const CamIcuSchema = z.object({
  acuteOnsetOrFluctuating: z.boolean(),
  inattention: z.boolean(),
  alteredLevelOfConsciousness: z.boolean(),
  disorganizedThinking: z.boolean(),
});
