import { Plan, Estimate } from './domain/types';
import { IEstimateService } from './domain/ports';

const AFFIRM_BASE_URL = 'https://calculator.affirm.com/promos/payment_estimate_path';

export class AffirmEstimateService implements IEstimateService {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(apiKey: string, baseUrl = AFFIRM_BASE_URL) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async getEstimates(amountCents: number, plans: Plan[]): Promise<Estimate[]> {
    return Promise.all(plans.map((plan) => this.fetchEstimate(amountCents, plan)));
  }

  private async fetchEstimate(amountCents: number, plan: Plan): Promise<Estimate> {
    const url = `${this.baseUrl}/${this.apiKey}/${plan.apr}/${amountCents}/${plan.months}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Affirm API error: ${response.status} ${response.statusText}`);
    }
    const json = await response.json();
    return {
      apr: plan.apr,
      aprString: String(json.apr),
      disclosure: json.disclosure,
      months: json.months,
      payment: json.payment,
      paymentString: json.payment_string,
    };
  }
}
