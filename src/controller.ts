import * as z from 'zod';
import { Service } from 'typedi';

import { EventData, dollarsTocents } from './lib';
import { AffirmAprCalculatorModel } from './model';
import { AffirmAprCalculatorView, ViewEvents } from './view';
import { AffirmClient, AffirmPlan } from './affirm.client';

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
    const { initialPurchaseAmount, initialSelectedApr, plans, apiKey, color } = options;

    this.affirmClient.initialize({ apiKey });

    const estimates = await this.affirmClient.getEstimates(
      dollarsTocents(initialPurchaseAmount),
      plans,
    );

    this.model.initialize({
      initialPurchaseAmount,
      initialSelectedApr,
      plans,
      estimates,
    });

    this.view.initialize({
      initialPurchaseAmount,
      initialSelectedApr,
      plans,
      color,
      estimates: this.model.getEstimatesForSelectedApr(),
      onEvent: (event, eventData) => this.handleViewEvent(event, eventData),
    });
  }

  private handleViewEvent(event: ViewEvents, eventData: EventData) {
    if (event === ViewEvents.PURCHASE_AMOUNT_CHANGED) {
      const parsed = PurchaseAmountChangedEvent.safeParse(eventData);
      if (!parsed.success) {
        throw new InvalidEvent(event, JSON.stringify(eventData));
      }
      this.handlePurchaseAmountChanged(parsed.data);
      return;
    }

    if (event === ViewEvents.SELECTED_APR_CHANGED) {
      const parsed = SelectedAprChangedEvent.safeParse(eventData);
      if (!parsed.success) {
        throw new InvalidEvent(event, JSON.stringify(eventData));
      }
      this.handleSelectedAprChanged(parsed.data);
      return;
    }

    console.warn(`received an unexpected event: ${event}, ignoring...`);
  }

  private async handlePurchaseAmountChanged(event: PurchaseAmountChangedEvent) {
    this.model.setPurchaseAmount(event.amount);
    this.view.updatePurchaseAmount(event.amount);

    const estimates = await this.affirmClient.getEstimates(
      dollarsTocents(this.model.getPurchaseAmount()),
      this.model.getPlans(),
    );
    this.model.setEstimates(estimates);
    this.view.updateEstimates(this.model.getEstimatesForSelectedApr());
  }

  private handleSelectedAprChanged(event: SelectedAprChangedEvent) {
    this.model.setSelectedApr(event.selectedApr);
    this.view.updateSelectedApr(this.model.getSelectedApr());
    this.view.updateEstimates(this.model.getEstimatesForSelectedApr());
  }
}
