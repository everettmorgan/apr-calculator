import { describe, it, expect } from 'vitest';
import { PurchaseAmountChangedEvent, SelectedAprChangedEvent } from '../events/schemas';

describe('PurchaseAmountChangedEvent', () => {
  it('accepts valid amount', () => {
    const result = PurchaseAmountChangedEvent.safeParse({ amount: 1500 });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.amount).toBe(1500);
  });

  it('rejects missing amount', () => {
    const result = PurchaseAmountChangedEvent.safeParse({});
    expect(result.success).toBe(false);
  });

  it('rejects string amount', () => {
    const result = PurchaseAmountChangedEvent.safeParse({ amount: '1500' });
    expect(result.success).toBe(false);
  });
});

describe('SelectedAprChangedEvent', () => {
  it('accepts valid selectedApr', () => {
    const result = SelectedAprChangedEvent.safeParse({ selectedApr: 0.10 });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.selectedApr).toBe(0.10);
  });

  it('rejects missing selectedApr', () => {
    const result = SelectedAprChangedEvent.safeParse({});
    expect(result.success).toBe(false);
  });
});
