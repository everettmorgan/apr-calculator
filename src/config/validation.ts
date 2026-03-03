import * as z from 'zod';

const PlanSchema = z.object({
  apr: z.number().min(0).max(1),
  months: z.number().int().positive(),
});

export const AprCalculatorOptionsSchema = z.object({
  apiKey: z.string().min(1),
  plans: z.array(PlanSchema).min(1),
  initialPurchaseAmount: z.number().positive(),
  initialSelectedApr: z.number().min(0).max(1),
  view: z.object({
    title: z.string().optional(),
    subtitle: z.string().optional(),
    color: z.string().optional(),
    mountSelector: z.string().optional(),
  }).optional(),
});
