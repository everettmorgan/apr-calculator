import { Token } from 'typedi';
import { Plan, Estimate } from './types';
import { ViewEvents } from '../events/view-events';

// --- Model Interface ---

export interface ICalculatorModel {
  getPurchaseAmount(): number;
  setPurchaseAmount(amount: number): void;
  getSelectedApr(): number;
  setSelectedApr(apr: number): void;
  getPlans(): Plan[];
  setPlans(plans: Plan[]): void;
  getEstimates(): Estimate[];
  getEstimatesForSelectedApr(): Estimate[];
  setEstimates(estimates: Estimate[]): void;
}

// --- View Interface ---

export interface ViewState {
  purchaseAmount?: number;
  selectedApr?: number;
  estimates?: Estimate[];
}

export interface ViewMountOptions {
  purchaseAmount: number;
  selectedApr: number;
  plans: Plan[];
  estimates: Estimate[];
  title?: string;
  subtitle?: string;
  color?: string;
  mountSelector?: string;
  onEvent: (event: ViewEvents, data: Record<string, unknown>) => void;
}

export interface ICalculatorView {
  mount(options: ViewMountOptions): void;
  updateState(state: ViewState): void;
}

// --- Estimate Service Interface ---

export interface IEstimateService {
  getEstimates(amountCents: number, plans: Plan[]): Promise<Estimate[]>;
}

// --- DI Tokens ---

export const MODEL_TOKEN = new Token<ICalculatorModel>('ICalculatorModel');
export const VIEW_TOKEN = new Token<ICalculatorView>('ICalculatorView');
export const ESTIMATE_SERVICE_TOKEN = new Token<IEstimateService>('IEstimateService');
