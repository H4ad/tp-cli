import { z } from 'zod';

export const TPTemplate = z.object({
  description: z.string(),
  installUrl: z.string().optional(),
  generate: z.record(z.object({
    description: z.string(),
    structure: z.record(z.union([
      z.object({
        content: z.string(),
      }),
      z.object({
        url: z.string(),
      }),
    ])).optional(),
  }).optional()),
});

export type TPTemplate = z.infer<typeof TPTemplate>;
export type TPGenerate = NonNullable<TPTemplate['generate'][string]>;
export type TPStructureItem = NonNullable<NonNullable<TPGenerate['structure']>[string]>

export const TPConfig = z.object({
  templates: z.record(z.string()),
});

export type TPConfig = z.infer<typeof TPConfig>;
