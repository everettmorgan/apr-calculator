import './elements/root.element';
import { Service } from 'typedi';
import { noop } from 'lodash';
import { AffirmCalculatorRoot } from './elements/root.element';

import { KV } from './lib';
import { AffirmEstimate, AffirmPlan } from './affirm.client';
import { AffirmCalculatorEstimates } from './elements/estimates';
import { AffirmCalculatorApr } from './elements/aprs-element';

export enum ViewEvents {
  PURCHASE_AMOUNT_CHANGED,
  SELECTED_APR_CHANGED
}

export interface OnEvent {
  (event: ViewEvents, eventData: KV): void;
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
    this.onEvent = options.onEvent ?? noop;
    this.render(options);
  }

  emitEvent(event: ViewEvents, eventData: KV) {
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

  render(options: AffirmAprCalculatorViewOptions) {
    this.rootElement = document.createElement('affirm-calculator');

    if (options.initialPurchaseAmount) {
      this.rootElement.purchaseAmount = options.initialPurchaseAmount;
    }

    if (options.initialSelectedApr) {
      this.rootElement.selectedApr = options.initialSelectedApr;
    }

    if (options.title) {
      this.rootElement.title = options.title;
    }

    if (options.subtitle) {
      this.rootElement.subtitle = options.subtitle;
    }

    if (options.color) {
      this.rootElement.color = options.color;
    }

    if (options.plans) {
      this.rootElement.plans = options.plans;
    }

    if (options.estimates) {
      this.rootElement.estimates = options.estimates;
    }

    if (options.color) {
      this.rootElement.color = options.color;
    }

    this.rootElement.addEventListener('affirm-amount-changed', (event: Event) => {
      const customEvent = event as CustomEvent<{ newAmount: number }>;
      this.emitEvent(ViewEvents.PURCHASE_AMOUNT_CHANGED, { amount: customEvent.detail.newAmount });
    });

    this.rootElement.addEventListener('affirm-apr-changed', (event: Event) => {
      const customEvent = event as CustomEvent<{ newApr: number }>;
      this.emitEvent(ViewEvents.SELECTED_APR_CHANGED, { selectedApr: customEvent.detail.newApr });
    });

    document.querySelector('#affirm-apr-calculator')?.replaceChildren(this.rootElement);
  }
}
