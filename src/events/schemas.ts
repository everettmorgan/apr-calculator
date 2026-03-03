import * as z from 'zod';

export const PurchaseAmountChangedEvent = z.object({
  amount: z.number(),
});

export const SelectedAprChangedEvent = z.object({
  selectedApr: z.number(),
});

export type PurchaseAmountChangedEvent = z.infer<typeof PurchaseAmountChangedEvent>;
export type SelectedAprChangedEvent = z.infer<typeof SelectedAprChangedEvent>;
