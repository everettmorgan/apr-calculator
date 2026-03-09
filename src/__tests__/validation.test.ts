import { describe, it, expect } from 'vitest';
import { AprCalculatorOptionsSchema } from '../config/validation';

const validConfig = {
  apiKey: 'test-key',
  plans: [{ apr: 0.10, months: 12 }],
  initialPurchaseAmount: 1500,
  initialSelectedApr: 0.10,
};

describe('AprCalculatorOptionsSchema', () => {
  it('accepts valid complete config', () => {
    const result = AprCalculatorOptionsSchema.safeParse(validConfig);
    expect(result.success).toBe(true);
  });

  it('accepts config with optional view', () => {
    const result = AprCalculatorOptionsSchema.safeParse({
      ...validConfig,
      view: { title: 'Test', color: '#fff' },
    });
    expect(result.success).toBe(true);
  });

  it('rejects missing apiKey', () => {
    const { apiKey: _, ...rest } = validConfig;
    const result = AprCalculatorOptionsSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it('rejects empty apiKey', () => {
    const result = AprCalculatorOptionsSchema.safeParse({ ...validConfig, apiKey: '' });
    expect(result.success).toBe(false);
  });

  it('rejects empty plans array', () => {
    const result = AprCalculatorOptionsSchema.safeParse({ ...validConfig, plans: [] });
    expect(result.success).toBe(false);
  });

  it('rejects APR greater than 1', () => {
    const result = AprCalculatorOptionsSchema.safeParse({
      ...validConfig,
      plans: [{ apr: 1.5, months: 12 }],
    });
    expect(result.success).toBe(false);
  });

  it('rejects negative APR', () => {
    const result = AprCalculatorOptionsSchema.safeParse({
      ...validConfig,
      plans: [{ apr: -0.1, months: 12 }],
    });
    expect(result.success).toBe(false);
  });

  it('rejects negative months', () => {
    const result = AprCalculatorOptionsSchema.safeParse({
      ...validConfig,
      plans: [{ apr: 0.10, months: -6 }],
    });
    expect(result.success).toBe(false);
  });

  it('rejects non-integer months', () => {
    const result = AprCalculatorOptionsSchema.safeParse({
      ...validConfig,
      plans: [{ apr: 0.10, months: 12.5 }],
    });
    expect(result.success).toBe(false);
  });

  it('rejects negative purchase amount', () => {
    const result = AprCalculatorOptionsSchema.safeParse({
      ...validConfig,
      initialPurchaseAmount: -100,
    });
    expect(result.success).toBe(false);
  });

  it('rejects zero purchase amount', () => {
    const result = AprCalculatorOptionsSchema.safeParse({
      ...validConfig,
      initialPurchaseAmount: 0,
    });
    expect(result.success).toBe(false);
  });
});
