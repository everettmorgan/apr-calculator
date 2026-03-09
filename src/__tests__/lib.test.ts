import { describe, it, expect } from 'vitest';
import { dollarsTocents, formatCents } from '../lib';

describe('dollarsTocents', () => {
  it('converts positive dollars to cents', () => {
    expect(dollarsTocents(15)).toBe(1500);
  });

  it('converts zero', () => {
    expect(dollarsTocents(0)).toBe(0);
  });

  it('converts decimal dollars', () => {
    expect(dollarsTocents(9.99)).toBeCloseTo(999);
  });

  it('converts negative dollars', () => {
    expect(dollarsTocents(-10)).toBe(-1000);
  });
});

describe('formatCents', () => {
  it('formats positive cents', () => {
    expect(formatCents(13198)).toBe('131.98');
  });

  it('formats zero', () => {
    expect(formatCents(0)).toBe('0.00');
  });

  it('formats negative cents', () => {
    expect(formatCents(-500)).toBe('-5.00');
  });

  it('pads single-digit cents', () => {
    expect(formatCents(105)).toBe('1.05');
  });

  it('formats large values', () => {
    expect(formatCents(1000000)).toBe('10000.00');
  });

  it('formats cents-only values', () => {
    expect(formatCents(42)).toBe('0.42');
  });
});
