import { describe, it, expect, vi, beforeEach } from 'vitest';
import '../elements/root.element';
import { CalculatorView } from '../view';
import { ViewMountOptions } from '../domain/ports';
import { ViewEvents } from '../events/view-events';
import { Estimate } from '../domain/types';

function makeEstimate(apr: number, months: number): Estimate {
  return {
    apr,
    aprString: String(apr * 100),
    disclosure: `Test ${apr} ${months}`,
    months,
    payment: 13198,
    paymentString: '131.98',
  };
}

function createMountOptions(overrides?: Partial<ViewMountOptions>): ViewMountOptions {
  return {
    purchaseAmount: 1500,
    selectedApr: 0.10,
    plans: [{ apr: 0.10, months: 12 }],
    estimates: [makeEstimate(0.10, 12)],
    onEvent: vi.fn(),
    ...overrides,
  };
}

describe('CalculatorView', () => {
  let view: CalculatorView;

  beforeEach(() => {
    document.body.innerHTML = '<div id="affirm-apr-calculator"></div>';
    view = new CalculatorView();
  });

  describe('mount', () => {
    it('creates and mounts element into container', () => {
      view.mount(createMountOptions());
      const container = document.querySelector('#affirm-apr-calculator');
      expect(container?.children).toHaveLength(1);
      expect(container?.children[0].tagName.toLowerCase()).toBe('affirm-calculator');
    });

    it('sets purchaseAmount on root element', () => {
      view.mount(createMountOptions({ purchaseAmount: 2000 }));
      const el = document.querySelector('affirm-calculator') as any;
      expect(el.purchaseAmount).toBe(2000);
    });

    it('sets selectedApr on root element', () => {
      view.mount(createMountOptions({ selectedApr: 0.20 }));
      const el = document.querySelector('affirm-calculator') as any;
      expect(el.selectedApr).toBe(0.20);
    });

    it('sets optional title when provided', () => {
      view.mount(createMountOptions({ title: 'Custom Title' }));
      const el = document.querySelector('affirm-calculator') as any;
      expect(el.title).toBe('Custom Title');
    });

    it('sets optional color when provided', () => {
      view.mount(createMountOptions({ color: '#ff0000' }));
      const el = document.querySelector('affirm-calculator') as any;
      expect(el.color).toBe('#ff0000');
    });

    it('throws when mount selector not found', () => {
      expect(() => view.mount(createMountOptions({ mountSelector: '#nonexistent' })))
        .toThrow('Mount target not found: #nonexistent');
    });

    it('uses custom mount selector', () => {
      document.body.innerHTML = '<div id="custom-mount"></div>';
      view.mount(createMountOptions({ mountSelector: '#custom-mount' }));
      const container = document.querySelector('#custom-mount');
      expect(container?.children).toHaveLength(1);
    });

    it('forwards affirm-amount-changed to onEvent', () => {
      const onEvent = vi.fn();
      view.mount(createMountOptions({ onEvent }));
      const el = document.querySelector('affirm-calculator')!;
      el.dispatchEvent(new CustomEvent('affirm-amount-changed', {
        detail: { newAmount: 2500 },
        bubbles: true,
        composed: true,
      }));
      expect(onEvent).toHaveBeenCalledWith(
        ViewEvents.PURCHASE_AMOUNT_CHANGED,
        { amount: 2500 },
      );
    });

    it('forwards affirm-apr-changed to onEvent', () => {
      const onEvent = vi.fn();
      view.mount(createMountOptions({ onEvent }));
      const el = document.querySelector('affirm-calculator')!;
      el.dispatchEvent(new CustomEvent('affirm-apr-changed', {
        detail: { newApr: 0.30 },
        bubbles: true,
        composed: true,
      }));
      expect(onEvent).toHaveBeenCalledWith(
        ViewEvents.SELECTED_APR_CHANGED,
        { selectedApr: 0.30 },
      );
    });
  });

  describe('updateState', () => {
    it('updates purchaseAmount on root element', () => {
      view.mount(createMountOptions());
      view.updateState({ purchaseAmount: 3000 });
      const el = document.querySelector('affirm-calculator') as any;
      expect(el.purchaseAmount).toBe(3000);
    });

    it('updates selectedApr on root element', () => {
      view.mount(createMountOptions());
      view.updateState({ selectedApr: 0.25 });
      const el = document.querySelector('affirm-calculator') as any;
      expect(el.selectedApr).toBe(0.25);
    });

    it('updates estimates on root element', () => {
      view.mount(createMountOptions());
      const newEstimates = [makeEstimate(0.20, 24)];
      view.updateState({ estimates: newEstimates });
      const el = document.querySelector('affirm-calculator') as any;
      expect(el.estimates).toEqual(newEstimates);
    });

    it('ignores undefined fields (partial update)', () => {
      view.mount(createMountOptions({ purchaseAmount: 1500, selectedApr: 0.10 }));
      view.updateState({ purchaseAmount: 2000 });
      const el = document.querySelector('affirm-calculator') as any;
      expect(el.purchaseAmount).toBe(2000);
      expect(el.selectedApr).toBe(0.10);
    });

    it('is a no-op when not mounted', () => {
      expect(() => view.updateState({ purchaseAmount: 2000 })).not.toThrow();
    });
  });
});
