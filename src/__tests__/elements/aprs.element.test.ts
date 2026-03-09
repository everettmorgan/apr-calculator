import {
  describe, it, expect, vi, beforeEach,
} from 'vitest';
import '../../elements/aprs.element';
import { AffirmCalculatorApr } from '../../elements/aprs.element';

describe('AffirmCalculatorApr', () => {
  let el: AffirmCalculatorApr;

  beforeEach(async () => {
    el = document.createElement('affirm-calculator-aprs') as AffirmCalculatorApr;
    el.aprs = [0.10, 0.20, 0.30];
    el.selectedApr = 0.10;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  it('renders APR buttons', async () => {
    const buttons = el.shadowRoot?.querySelectorAll('.affirm-calculator-apr');
    expect(buttons?.length).toBe(3);
  });

  it('active APR gets active class', async () => {
    const buttons = el.shadowRoot?.querySelectorAll('.affirm-calculator-apr');
    const first = buttons?.[0];
    expect(first?.classList.contains('active')).toBe(true);
  });

  it('non-active APR does not get active class', async () => {
    const buttons = el.shadowRoot?.querySelectorAll('.affirm-calculator-apr');
    const second = buttons?.[1];
    expect(second?.classList.contains('active')).toBe(false);
  });

  it('displays APR percentage text', async () => {
    const buttons = el.shadowRoot?.querySelectorAll('.affirm-calculator-apr');
    expect(buttons?.[0]?.textContent?.trim()).toContain('10');
    expect(buttons?.[1]?.textContent?.trim()).toContain('20');
    expect(buttons?.[2]?.textContent?.trim()).toContain('30');
  });

  it('click dispatches affirm-apr-changed with correct APR', async () => {
    const handler = vi.fn();
    el.addEventListener('affirm-apr-changed', handler);

    const buttons = el.shadowRoot?.querySelectorAll('.affirm-calculator-apr');
    (buttons?.[1] as HTMLElement)?.click();

    expect(handler).toHaveBeenCalledTimes(1);
    const event = handler.mock.calls[0][0] as CustomEvent;
    expect(event.detail.newApr).toBe(0.20);
  });

  it('click updates selectedApr', async () => {
    const buttons = el.shadowRoot?.querySelectorAll('.affirm-calculator-apr');
    (buttons?.[2] as HTMLElement)?.click();
    expect(el.selectedApr).toBe(0.30);
  });
});
