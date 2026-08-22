import { z } from 'zod';

export const PermeSchema = z.object({
  mentalStatus: z.number().int().min(0).max(3),
  mobilityBarriers: z.number().int().min(0).max(2),
  functionalStrength: z.number().int().min(0).max(3),
  bedMobility: z.number().int().min(0).max(3),
  transfers: z.number().int().min(0).max(5),
  gait: z.number().int().min(0).max(3),
  endurance: z.number().int().min(0).max(3),
});
