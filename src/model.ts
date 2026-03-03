import { Service } from 'typedi';
import { Plan, Estimate } from './domain/types';
import { ICalculatorModel, MODEL_TOKEN } from './domain/ports';

@Service({ id: MODEL_TOKEN })
export class CalculatorModel implements ICalculatorModel {
  private purchaseAmount = 0;
  private selectedApr = 0;
  private plans: Plan[] = [];
  private estimates: Estimate[] = [];

  getPurchaseAmount(): number {
    return this.purchaseAmount;
  }

  setPurchaseAmount(amount: number): void {
    this.purchaseAmount = amount;
  }

  getSelectedApr(): number {
    return this.selectedApr;
  }

  setSelectedApr(apr: number): void {
    this.selectedApr = apr;
  }

  getPlans(): Plan[] {
    return [...this.plans];
  }

  setPlans(plans: Plan[]): void {
    this.plans = plans;
  }

  getEstimates(): Estimate[] {
    return this.estimates;
  }

  getEstimatesForSelectedApr(): Estimate[] {
    return this.estimates.filter(
      (estimate) => estimate.apr === this.selectedApr,
    );
  }

  setEstimates(estimates: Estimate[]): void {
    this.estimates = estimates;
  }
}
