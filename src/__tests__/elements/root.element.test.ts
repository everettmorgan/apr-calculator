import {
  describe, it, expect, beforeEach,
} from 'vitest';
import '../../elements/root.element';
import { AffirmCalculatorRoot } from '../../elements/root.element';

describe('AffirmCalculatorRoot', () => {
  let el: AffirmCalculatorRoot;

  beforeEach(async () => {
    el = document.createElement('affirm-calculator') as AffirmCalculatorRoot;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  it('renders title', async () => {
    el.title = 'Test Title';
    await el.updateComplete;
    const h1 = el.shadowRoot?.querySelector('h1');
    expect(h1?.textContent).toBe('Test Title');
  });

  it('renders subtitle', async () => {
    el.subtitle = 'Test Subtitle';
    await el.updateComplete;
    const h4 = el.shadowRoot?.querySelector('h4');
    expect(h4?.textContent).toBe('Test Subtitle');
  });

  it('passes purchaseAmount to amount child', async () => {
    el.purchaseAmount = 2500;
    await el.updateComplete;
    const amountEl = el.shadowRoot?.querySelector('affirm-calculator-amount') as any;
    expect(amountEl?.amount).toBe(2500);
  });

  it('passes selectedApr to aprs child', async () => {
    el.selectedApr = 0.20;
    el.plans = [{ apr: 0.10, months: 12 }, { apr: 0.20, months: 24 }];
    await el.updateComplete;
    const aprsEl = el.shadowRoot?.querySelector('affirm-calculator-aprs') as any;
    expect(aprsEl?.selectedApr).toBe(0.20);
  });

  it('passes unique APRs to aprs child', async () => {
    el.plans = [
      { apr: 0.10, months: 12 },
      { apr: 0.10, months: 24 },
      { apr: 0.20, months: 12 },
    ];
    await el.updateComplete;
    const aprsEl = el.shadowRoot?.querySelector('affirm-calculator-aprs') as any;
    expect(aprsEl?.aprs).toEqual([0.10, 0.20]);
  });

  it('passes estimates to estimates child', async () => {
    const estimates = [{
      apr: 0.10,
      aprString: '10',
      disclosure: 'Test',
      months: 12,
      payment: 13198,
      paymentString: '131.98',
    }];
    el.estimates = estimates;
    await el.updateComplete;
    const estimatesEl = el.shadowRoot?.querySelector('affirm-calculator-estimates') as any;
    expect(estimatesEl?.estimates).toEqual(estimates);
  });
});
