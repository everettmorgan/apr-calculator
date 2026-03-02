import './elements/root.element';
import { Service } from 'typedi';
import { AffirmCalculatorRoot } from './elements/root.element';

import { EventData } from './lib';
import { AffirmEstimate, AffirmPlan } from './affirm.client';
import { AffirmCalculatorEstimates } from './elements/estimates.element';
import { AffirmCalculatorApr } from './elements/aprs.element';

export enum ViewEvents {
  PURCHASE_AMOUNT_CHANGED,
  SELECTED_APR_CHANGED
}

export interface OnEvent {
  (event: ViewEvents, eventData: EventData): void;
}

export interface AffirmAprCalculatorViewOptions {
  title?: string;
  subtitle?: string;
  color?: string;
  initialPurchaseAmount: number;
  initialSelectedApr: number;
  plans: AffirmPlan[];
  estimates: AffirmEstimate[];
  onEvent?: OnEvent;
}

@Service()
export class AffirmAprCalculatorView {
  private onEvent?: OnEvent;

  private rootElement?: AffirmCalculatorRoot;

  initialize(options: AffirmAprCalculatorViewOptions) {
    this.onEvent = options.onEvent ?? (() => {});
    this.render(options);
  }

  emitEvent(event: ViewEvents, eventData: EventData) {
    return this.onEvent?.(event, eventData);
  }

  updatePurchaseAmount(newAmount: number) {
    if (this.rootElement) {
      const old = this.rootElement.purchaseAmount;
      this.rootElement.purchaseAmount = newAmount;
      this.rootElement.requestUpdate('purchaseAmount', old);
    }
  }

  updateSelectedApr(newApr: number) {
    const { rootElement } = this;

    if (rootElement) {
      const old = rootElement.selectedApr;
      rootElement.selectedApr = newApr;
      rootElement.requestUpdate('selectedApr', old);

      const estimatesElement = rootElement.shadowRoot?.querySelector('affirm-calculator-aprs') as AffirmCalculatorApr;
      estimatesElement.selectedApr = newApr;
      estimatesElement.requestUpdate('selectedApr', old);
    }
  }

  updateEstimates(newEstimates: AffirmEstimate[]) {
    const { rootElement } = this;

    if (rootElement) {
      const old = rootElement.estimates;

      rootElement.estimates = newEstimates;
      rootElement.requestUpdate('estimates', old);

      const estimatesElement = rootElement.shadowRoot?.querySelector('affirm-calculator-estimates') as AffirmCalculatorEstimates;
      estimatesElement.estimates = newEstimates;
      estimatesElement.requestUpdate('estimates', old);
    }
  }

  private render(options: AffirmAprCalculatorViewOptions) {
    const root = document.createElement('affirm-calculator');
    this.rootElement = root;

    root.purchaseAmount = options.initialPurchaseAmount;
    root.selectedApr = options.initialSelectedApr;
    root.plans = options.plans;
    root.estimates = options.estimates;

    if (options.title) root.title = options.title;
    if (options.subtitle) root.subtitle = options.subtitle;
    if (options.color) root.color = options.color;

    root.addEventListener('affirm-amount-changed', (event: Event) => {
      const { newAmount } = (event as CustomEvent<{ newAmount: number }>).detail;
      this.emitEvent(ViewEvents.PURCHASE_AMOUNT_CHANGED, { amount: newAmount });
    });

    root.addEventListener('affirm-apr-changed', (event: Event) => {
      const { newApr } = (event as CustomEvent<{ newApr: number }>).detail;
      this.emitEvent(ViewEvents.SELECTED_APR_CHANGED, { selectedApr: newApr });
    });

    document.querySelector('#affirm-apr-calculator')?.replaceChildren(root);
  }
}
