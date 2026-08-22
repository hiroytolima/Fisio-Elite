import { z } from 'zod';

export const PermeSchema = z.object({
  mentalStatus: z.number().int().min(0).max(3),
  mobilityBarriers: z.number().int().min(0).max(4),
  functionalStrength: z.number().int().min(0).max(4),
  bedMobility: z.number().int().min(0).max(6),
  transfers: z.number().int().min(0).max(6),
  gait: z.number().int().min(0).max(3),
  endurance: z.number().int().min(0).max(3),
});
