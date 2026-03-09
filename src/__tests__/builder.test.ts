import {
  describe, it, expect, beforeEach,
} from 'vitest';
import { create } from '../index';

describe('AprCalculatorBuilder', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="affirm-apr-calculator"></div>';
  });

  it('create() returns a builder', () => {
    const builder = create();
    expect(builder).toBeDefined();
    expect(typeof builder.withApiKey).toBe('function');
    expect(typeof builder.withPlans).toBe('function');
    expect(typeof builder.withInitialState).toBe('function');
    expect(typeof builder.withViewOptions).toBe('function');
    expect(typeof builder.mount).toBe('function');
  });

  it('create({apiKey}) pre-sets API key', () => {
    const builder = create({ apiKey: 'test-key' });
    expect(builder).toBeDefined();
  });

  it('builder methods are chainable', () => {
    const builder = create();
    const result = builder
      .withApiKey('key')
      .withPlans([{ apr: 0.10, months: 12 }])
      .withInitialState({ purchaseAmount: 1500, selectedApr: 0.10 })
      .withViewOptions({ title: 'Test' });
    expect(result).toBe(builder);
  });

  it('mount() throws on invalid config (empty apiKey)', () => {
    const builder = create()
      .withPlans([{ apr: 0.10, months: 12 }])
      .withInitialState({ purchaseAmount: 1500, selectedApr: 0.10 });
    expect(() => builder.mount()).toThrow();
  });

  it('mount() throws on invalid config (no plans)', () => {
    const builder = create({ apiKey: 'test-key' })
      .withInitialState({ purchaseAmount: 1500, selectedApr: 0.10 });
    expect(() => builder.mount()).toThrow();
  });
});
