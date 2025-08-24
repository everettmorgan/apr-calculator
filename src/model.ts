import { Service } from 'typedi';
import { AffirmEstimate, AffirmPlan } from './affirm.client';

interface AffirmCalculatorModelOptions {
  initialPurchaseAmount: number;
  initialSelectedApr: number;
  plans: AffirmPlan[];
  estimates: AffirmEstimate[];
}

@Service()
export class AffirmAprCalculatorModel {
  private purchaseAmount: number;

  private selectedApr: number;

  private plans: AffirmPlan[];

  private estimates: AffirmEstimate[];

  constructor() {
    this.purchaseAmount = 0;
    this.selectedApr = 0;
    this.plans = [];
    this.estimates = [];
  }

  initialize(options: AffirmCalculatorModelOptions) {
    this.purchaseAmount = options.initialPurchaseAmount;
    this.selectedApr = options.initialSelectedApr;
    this.estimates = options.estimates;
    this.plans = options.plans;
  }

  getPurchaseAmount() {
    return this.purchaseAmount;
  }

  setPurchaseAmount(amount: number) {
    this.purchaseAmount = amount;
  }

  getSelectedApr() {
    return this.selectedApr;
  }

  setSelectedApr(apr: number) {
    this.selectedApr = apr;
  }

  getPlans() {
    return [...this.plans];
  }

  setPlans(plans: AffirmPlan[]) {
    this.plans = plans;
  }

  getEstimates() {
    return this.estimates;
  }

  setEstimates(newEstimates: AffirmEstimate[]) {
    this.estimates = newEstimates;
  }
}
