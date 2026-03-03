import './elements/root.element';
import { Service } from 'typedi';
import { AffirmCalculatorRoot } from './elements/root.element';
import { ViewEvents } from './events/view-events';
import { ICalculatorView, ViewMountOptions, ViewState, VIEW_TOKEN } from './domain/ports';

const DEFAULT_MOUNT_SELECTOR = '#affirm-apr-calculator';

@Service({ id: VIEW_TOKEN })
export class CalculatorView implements ICalculatorView {
  private rootElement?: AffirmCalculatorRoot;

  mount(options: ViewMountOptions): void {
    const root = document.createElement('affirm-calculator');
    this.rootElement = root;

    root.purchaseAmount = options.purchaseAmount;
    root.selectedApr = options.selectedApr;
    root.plans = options.plans;
    root.estimates = options.estimates;

    if (options.title) root.title = options.title;
    if (options.subtitle) root.subtitle = options.subtitle;
    if (options.color) root.color = options.color;

    root.addEventListener('affirm-amount-changed', (event: Event) => {
      const { newAmount } = (event as CustomEvent<{ newAmount: number }>).detail;
      options.onEvent(ViewEvents.PURCHASE_AMOUNT_CHANGED, { amount: newAmount });
    });

    root.addEventListener('affirm-apr-changed', (event: Event) => {
      const { newApr } = (event as CustomEvent<{ newApr: number }>).detail;
      options.onEvent(ViewEvents.SELECTED_APR_CHANGED, { selectedApr: newApr });
    });

    const selector = options.mountSelector ?? DEFAULT_MOUNT_SELECTOR;
    const container = document.querySelector(selector);
    if (!container) {
      throw new Error(`Mount target not found: ${selector}`);
    }
    container.replaceChildren(root);
  }

  updateState(state: ViewState): void {
    if (!this.rootElement) return;

    if (state.purchaseAmount !== undefined) {
      this.rootElement.purchaseAmount = state.purchaseAmount;
    }
    if (state.selectedApr !== undefined) {
      this.rootElement.selectedApr = state.selectedApr;
    }
    if (state.estimates !== undefined) {
      this.rootElement.estimates = state.estimates;
    }
  }
}
