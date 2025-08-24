import * as z from 'zod';
import { Service } from 'typedi';

import { KV } from './lib';
import { AffirmAprCalculatorModel } from './model';
import { AffirmAprCalculatorView, ViewEvents } from './view';
import { AffirmClient, AffirmEstimate, AffirmPlan } from './affirm.client';

const PurchaseAmountChangedEvent = z.object({
  amount: z.number(),
});

const SelectedAprChangedEvent = z.object({
  selectedApr: z.number(),
});

type PurchaseAmountChangedEvent = z.infer<typeof PurchaseAmountChangedEvent>;
type SelectedAprChangedEvent = z.infer<typeof SelectedAprChangedEvent>;

class InvalidEvent extends Error {
  constructor(event: ViewEvents, data: string) {
    super(`received an invalid event: ${event}: ${data}`);
  }
}

export type AffirmCalculatorControllerOptions = {
  apiKey: string;
  plans: AffirmPlan[];
  initialPurchaseAmount: number;
  initialSelectedApr: number;

  maxPurchaseAmount: number;
  minPurchaseAmount: number;

  title?: string;
  subtitle?: string;
  disclaimer?: string;
  color?: string;
}

@Service()
export class AffirmAprCalculatorController {
  constructor(
    private model: AffirmAprCalculatorModel,
    private view: AffirmAprCalculatorView,
    private affirmClient: AffirmClient,
  ) {}

  async initialize(options: AffirmCalculatorControllerOptions) {
    const purchaseAmount = options.initialPurchaseAmount;
    const selectedApr = options.initialSelectedApr;

    this.affirmClient.initialize({
      apiKey: options.apiKey,
    });

    const estimates = await this.affirmClient.getEstimates(
      purchaseAmount * 100,
      options.plans,
    );

    this.model.initialize({
      initialPurchaseAmount: purchaseAmount,
      initialSelectedApr: selectedApr,
      plans: options.plans,
      estimates,
    });

    const estimatesForSelectedApr = estimates.filter(
      (estimate) => estimate.apr === options.initialSelectedApr,
    );

    this.view.initialize({
      initialPurchaseAmount: purchaseAmount,
      initialSelectedApr: selectedApr,
      plans: options.plans,
      color: options.color,
      estimates: estimatesForSelectedApr,
      onEvent: (event, eventData) => {
        this.handleViewEvent.apply(this, [event, eventData]);
      },
    });
  }

  handleViewEvent(event: ViewEvents, eventData: KV) {
    if (event === ViewEvents.PURCHASE_AMOUNT_CHANGED) {
      const parsedPurchaseAmount = PurchaseAmountChangedEvent.safeParse(eventData);
      if (!parsedPurchaseAmount.success) {
        throw new InvalidEvent(event, JSON.stringify(eventData));
      }
      this.handlePurchaseAmountEvent(parsedPurchaseAmount.data);
      return;
    }

    if (event === ViewEvents.SELECTED_APR_CHANGED) {
      const parsedSelectedApr = SelectedAprChangedEvent.safeParse(eventData);
      if (!parsedSelectedApr.success) {
        throw new InvalidEvent(event, JSON.stringify(eventData));
      }
      this.handleSelectedAprEvent(parsedSelectedApr.data);
      return;
    }

    console.warn(`received an unexpected event: ${event}, ignoring...`);
  }

  private handlePurchaseAmountEvent(event: PurchaseAmountChangedEvent) {
    this.model.setPurchaseAmount(event.amount);
    this.view.updatePurchaseAmount(event.amount);

    this.affirmClient.getEstimates(this.model.getPurchaseAmount() * 100, this.model.getPlans())
      .then((estimates: AffirmEstimate[]) => {
        const estimatesForSelectedApr = estimates.filter(
          (estimate) => estimate.apr === this.model.getSelectedApr(),
        );
        this.model.setEstimates(estimates);
        this.view.updateEstimates(estimatesForSelectedApr);
      });
  }

  private handleSelectedAprEvent(event: SelectedAprChangedEvent) {
    this.model.setSelectedApr(event.selectedApr);
    this.view.updateSelectedApr(this.model.getSelectedApr());
    const estimates = this.model.getEstimates();
    const estimatesForSelectedApr = estimates.filter(
      (estimate) => estimate.apr === this.model.getSelectedApr(),
    );
    this.view.updateEstimates(estimatesForSelectedApr);
  }
}
