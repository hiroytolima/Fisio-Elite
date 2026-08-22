import { z } from 'zod';

const scoreValueSchema = z.number().int().min(0).max(5);

export const MrcSchema = z.object({
  scores: z.object({
    shoulderAbductionRight: scoreValueSchema,
    shoulderAbductionLeft: scoreValueSchema,
    elbowFlexionRight: scoreValueSchema,
    elbowFlexionLeft: scoreValueSchema,
    wristExtensionRight: scoreValueSchema,
    wristExtensionLeft: scoreValueSchema,
    hipFlexionRight: scoreValueSchema,
    hipFlexionLeft: scoreValueSchema,
    kneeExtensionRight: scoreValueSchema,
    kneeExtensionLeft: scoreValueSchema,
    ankleDorsiflexionRight: scoreValueSchema,
    ankleDorsiflexionLeft: scoreValueSchema,
  }),
});
