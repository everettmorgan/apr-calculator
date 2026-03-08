import { Plan } from '../domain/types';

export interface ApiConfig {
  apiKey: string;
}

export interface CalculatorConfig {
  plans: Plan[];
  initialPurchaseAmount: number;
  initialSelectedApr: number;
}

export interface ViewConfig {
  title?: string;
  subtitle?: string;
  color?: string;
  mountSelector?: string;
}