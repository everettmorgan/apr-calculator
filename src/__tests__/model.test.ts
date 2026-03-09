import {
  describe, it, expect, beforeEach,
} from 'vitest';
import { CalculatorModel } from '../model';
import { Estimate, Plan } from '../domain/types';

describe('CalculatorModel', () => {
  let model: CalculatorModel;

  beforeEach(() => {
    model = new CalculatorModel();
  });

  it('has zero/empty defaults', () => {
    expect(model.getPurchaseAmount()).toBe(0);
    expect(model.getSelectedApr()).toBe(0);
    expect(model.getPlans()).toEqual([]);
    expect(model.getEstimates()).toEqual([]);
  });

  describe('purchaseAmount', () => {
    it('sets and gets purchase amount', () => {
      model.setPurchaseAmount(1500);
      expect(model.getPurchaseAmount()).toBe(1500);
    });
  });

  describe('selectedApr', () => {
    it('sets and gets selected APR', () => {
      model.setSelectedApr(0.15);
      expect(model.getSelectedApr()).toBe(0.15);
    });
  });

  describe('plans', () => {
    it('sets and gets plans', () => {
      const plans: Plan[] = [{ apr: 0.10, months: 12 }];
      model.setPlans(plans);
      expect(model.getPlans()).toEqual(plans);
    });

    it('returns a copy to prevent mutation', () => {
      const plans: Plan[] = [{ apr: 0.10, months: 12 }];
      model.setPlans(plans);
      const returned = model.getPlans();
      returned.push({ apr: 0.20, months: 24 });
      expect(model.getPlans()).toHaveLength(1);
    });
  });

  describe('estimates', () => {
    it('sets and gets estimates', () => {
      const estimates = [makeEstimate(0.10, 12)];
      model.setEstimates(estimates);
      expect(model.getEstimates()).toEqual(estimates);
    });
  });

  describe('getEstimatesForSelectedApr', () => {
    const estimates: Estimate[] = [
      makeEstimate(0.10, 12),
      makeEstimate(0.10, 24),
      makeEstimate(0.20, 12),
      makeEstimate(0.30, 36),
    ];

    beforeEach(() => {
      model.setEstimates(estimates);
    });

    it('filters estimates by selected APR', () => {
      model.setSelectedApr(0.10);
      const result = model.getEstimatesForSelectedApr();
      expect(result).toHaveLength(2);
      expect(result.every((e) => e.apr === 0.10)).toBe(true);
    });

    it('returns empty when no estimates match', () => {
      model.setSelectedApr(0.50);
      expect(model.getEstimatesForSelectedApr()).toEqual([]);
    });

    it('returns single match', () => {
      model.setSelectedApr(0.30);
      const result = model.getEstimatesForSelectedApr();
      expect(result).toHaveLength(1);
      expect(result[0].months).toBe(36);
    });
  });
});

function makeEstimate(apr: number, months: number): Estimate {
  return {
    apr,
    aprString: String(apr * 100),
    disclosure: `Test disclosure for ${apr} APR ${months} months`,
    months,
    payment: 13198,
    paymentString: '131.98',
  };
}
