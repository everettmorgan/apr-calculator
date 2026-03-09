import {
  describe, it, expect, vi, beforeEach,
} from 'vitest';
import '../../elements/amount.element';
import { AffirmCalculatorAmountInput } from '../../elements/amount.element';

describe('AffirmCalculatorAmountInput', () => {
  let el: AffirmCalculatorAmountInput;

  beforeEach(async () => {
    el = document.createElement('affirm-calculator-amount') as AffirmCalculatorAmountInput;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  it('renders with default amount 0', async () => {
    expect(el.amount).toBe(0);
  });

  it('renders input with amount value', async () => {
    el.amount = 2500;
    await el.updateComplete;
    const input = el.shadowRoot?.querySelector('input');
    expect(input).toBeTruthy();
  });

  it('dispatches affirm-amount-changed on input change', async () => {
    el.amount = 1500;
    await el.updateComplete;

    const handler = vi.fn();
    el.addEventListener('affirm-amount-changed', handler);

    const input = el.shadowRoot?.querySelector('input')!;
    // Simulate typing a value and triggering change
    (input as any).value = '2000';
    input.dispatchEvent(new Event('change'));

    expect(handler).toHaveBeenCalledTimes(1);
    const event = handler.mock.calls[0][0] as CustomEvent;
    expect(event.detail.newAmount).toBe(2000);
  });

  it('event bubbles and is composed', async () => {
    el.amount = 1500;
    await el.updateComplete;

    const handler = vi.fn();
    document.body.addEventListener('affirm-amount-changed', handler);

    const input = el.shadowRoot?.querySelector('input')!;
    (input as any).value = '3000';
    input.dispatchEvent(new Event('change'));

    expect(handler).toHaveBeenCalledTimes(1);
    document.body.removeEventListener('affirm-amount-changed', handler);
  });
});
