import { Inject, Service } from 'typedi';
import { dollarsTocents } from './lib';
import { Plan } from './domain/types';
import {
  ICalculatorModel, ICalculatorView, IEstimateService,
  MODEL_TOKEN, VIEW_TOKEN, ESTIMATE_SERVICE_TOKEN,
} from './domain/ports';
import { ViewEvents } from './events/view-events';
import { PurchaseAmountChangedEvent, SelectedAprChangedEvent } from './events/schemas';
import { InvalidEventError } from './events/errors';
import { CalculatorConfig, ViewConfig } from './config/options';

type EventHandler = (data: Record<string, unknown>) => void;

@Service()
export class CalculatorController {
  private readonly eventHandlers: Map<ViewEvents, EventHandler>;

  constructor(
    @Inject(MODEL_TOKEN) private model: ICalculatorModel,
    @Inject(VIEW_TOKEN) private view: ICalculatorView,
    @Inject(ESTIMATE_SERVICE_TOKEN) private estimateService: IEstimateService,
  ) {
    this.eventHandlers = new Map([
      [ViewEvents.PURCHASE_AMOUNT_CHANGED, (data) => this.handlePurchaseAmountChanged(data)],
      [ViewEvents.SELECTED_APR_CHANGED, (data) => this.handleSelectedAprChanged(data)],
    ]);
  }

  async initialize(config: CalculatorConfig, viewConfig?: ViewConfig): Promise<void> {
    const { initialPurchaseAmount, initialSelectedApr, plans } = config;

    this.initializeModel(initialPurchaseAmount, initialSelectedApr, plans);

    const estimates = await this.estimateService.getEstimates(
      dollarsTocents(initialPurchaseAmount),
      plans,
    );
    this.model.setEstimates(estimates);

    this.view.mount({
      purchaseAmount: initialPurchaseAmount,
      selectedApr: initialSelectedApr,
      plans,
      estimates: this.model.getEstimatesForSelectedApr(),
      title: viewConfig?.title,
      subtitle: viewConfig?.subtitle,
      color: viewConfig?.color,
      mountSelector: viewConfig?.mountSelector,
      onEvent: (event, data) => this.handleViewEvent(event, data),
    });
  }

  private initializeModel(purchaseAmount: number, selectedApr: number, plans: Plan[]): void {
    this.model.setPurchaseAmount(purchaseAmount);
    this.model.setSelectedApr(selectedApr);
    this.model.setPlans(plans);
  }

  private handleViewEvent(event: ViewEvents, data: Record<string, unknown>): void {
    const handler = this.eventHandlers.get(event);
    if (handler) {
      handler(data);
      return;
    }
    console.warn(`received an unexpected event: ${event}, ignoring...`);
  }

  private handlePurchaseAmountChanged(data: Record<string, unknown>): void {
    const parsed = PurchaseAmountChangedEvent.safeParse(data);
    if (!parsed.success) {
      throw new InvalidEventError(ViewEvents.PURCHASE_AMOUNT_CHANGED, JSON.stringify(data));
    }

    this.model.setPurchaseAmount(parsed.data.amount);
    this.view.updateState({ purchaseAmount: parsed.data.amount });

    this.estimateService.getEstimates(
      dollarsTocents(this.model.getPurchaseAmount()),
      this.model.getPlans(),
    ).then((estimates) => {
      this.model.setEstimates(estimates);
      this.view.updateState({ estimates: this.model.getEstimatesForSelectedApr() });
    });
  }

  private handleSelectedAprChanged(data: Record<string, unknown>): void {
    const parsed = SelectedAprChangedEvent.safeParse(data);
    if (!parsed.success) {
      throw new InvalidEventError(ViewEvents.SELECTED_APR_CHANGED, JSON.stringify(data));
    }

    this.model.setSelectedApr(parsed.data.selectedApr);
    this.view.updateState({
      selectedApr: this.model.getSelectedApr(),
      estimates: this.model.getEstimatesForSelectedApr(),
    });
  }
}
