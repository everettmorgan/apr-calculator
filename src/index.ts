import 'reflect-metadata';
import './model';
import './view';

import { Container } from 'typedi';
import { Plan } from './domain/types';
import { ESTIMATE_SERVICE_TOKEN } from './domain/ports';
import { ApiConfig, CalculatorConfig, ViewConfig, AprCalculatorOptions } from './config/options';
import { AprCalculatorOptionsSchema } from './config/validation';
import { AffirmEstimateService } from './affirm.client';
import { CalculatorController } from './controller';

class AprCalculatorBuilder {
  private apiConfig?: ApiConfig;
  private calcConfig: Partial<CalculatorConfig> = {};
  private viewConfig: ViewConfig = {};

  withApiKey(apiKey: string): this {
    this.apiConfig = { apiKey };
    return this;
  }

  withPlans(plans: Plan[]): this {
    this.calcConfig.plans = plans;
    return this;
  }

  withInitialState(state: { purchaseAmount: number; selectedApr: number }): this {
    this.calcConfig.initialPurchaseAmount = state.purchaseAmount;
    this.calcConfig.initialSelectedApr = state.selectedApr;
    return this;
  }

  withViewOptions(options: ViewConfig): this {
    this.viewConfig = { ...this.viewConfig, ...options };
    return this;
  }

  mount(selector?: string): void {
    if (selector) {
      this.viewConfig.mountSelector = selector;
    }

    const options: AprCalculatorOptions = {
      apiKey: this.apiConfig?.apiKey ?? '',
      plans: this.calcConfig.plans ?? [],
      initialPurchaseAmount: this.calcConfig.initialPurchaseAmount ?? 0,
      initialSelectedApr: this.calcConfig.initialSelectedApr ?? 0,
      view: this.viewConfig,
    };

    const validated = AprCalculatorOptionsSchema.parse(options);
    bootApplication(
      { apiKey: validated.apiKey },
      {
        plans: validated.plans,
        initialPurchaseAmount: validated.initialPurchaseAmount,
        initialSelectedApr: validated.initialSelectedApr,
      },
      validated.view,
    );
  }
}

function bootApplication(api: ApiConfig, calc: CalculatorConfig, view?: ViewConfig): void {
  const estimateService = new AffirmEstimateService(api.apiKey);
  Container.set(ESTIMATE_SERVICE_TOKEN, estimateService);

  document.addEventListener('DOMContentLoaded', () => {
    const controller = Container.get(CalculatorController);
    controller.initialize(calc, view);
  });
}

export function create(apiConfig?: ApiConfig): AprCalculatorBuilder {
  const builder = new AprCalculatorBuilder();
  if (apiConfig) {
    builder.withApiKey(apiConfig.apiKey);
  }
  return builder;
}

export function Initialize(options: AprCalculatorOptions): void {
  const validated = AprCalculatorOptionsSchema.parse(options);
  bootApplication(
    { apiKey: validated.apiKey },
    {
      plans: validated.plans,
      initialPurchaseAmount: validated.initialPurchaseAmount,
      initialSelectedApr: validated.initialSelectedApr,
    },
    validated.view,
  );
}
