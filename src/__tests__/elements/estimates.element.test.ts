import { describe, it, expect, beforeEach } from 'vitest';
import '../../elements/estimates.element';
import { AffirmCalculatorEstimates } from '../../elements/estimates.element';
import { Estimate } from '../../domain/types';

function makeEstimate(apr: number, months: number, payment: number): Estimate {
  return {
    apr,
    aprString: String(apr * 100),
    disclosure: `Disclosure for ${apr} ${months}`,
    months,
    payment,
    paymentString: String(payment),
  };
}

describe('AffirmCalculatorEstimates', () => {
  let el: AffirmCalculatorEstimates;

  beforeEach(async () => {
    el = document.createElement('affirm-calculator-estimates') as AffirmCalculatorEstimates;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  it('renders empty state with no estimates', async () => {
    const cards = el.shadowRoot?.querySelectorAll('.affirm-calculator-estimate');
    expect(cards?.length).toBe(0);
  });

  it('renders estimate cards', async () => {
    el.estimates = [
      makeEstimate(0.10, 12, 13198),
      makeEstimate(0.10, 24, 6900),
    ];
    await el.updateComplete;
    const cards = el.shadowRoot?.querySelectorAll('.affirm-calculator-estimate');
    expect(cards?.length).toBe(2);
  });

  it('displays formatted payment', async () => {
    el.estimates = [makeEstimate(0.10, 12, 13198)];
    await el.updateComplete;
    const text = el.shadowRoot?.querySelector('.affirm-calculator-estimate')?.textContent;
    expect(text).toContain('$131.98/mo');
  });

  it('displays months', async () => {
    el.estimates = [makeEstimate(0.10, 24, 6900)];
    await el.updateComplete;
    const text = el.shadowRoot?.querySelector('.affirm-calculator-estimate')?.textContent;
    expect(text).toContain('24 months');
  });
});
