import { Service } from 'typedi';

const AFFIRM_BASE_URL = 'https://calculator.affirm.com/promos/payment_estimate_path';

export interface AffirmPlan {
    apr: number;
    months: number;
}

export interface AffirmEstimate {
  apr: number;
  apr_string: string;
  disclosure: string;
  months: number;
  payment: number;
  payment_string: string;
}

interface AffirmClientOptions {
  apiKey: string;
}

@Service()
export class AffirmClient {
  private apiKey: string;

  private baseUrl: string;

  constructor() {
    this.apiKey = '';
    this.baseUrl = AFFIRM_BASE_URL;
  }

  initialize(options: AffirmClientOptions) {
    this.apiKey = options.apiKey;
  }

  private buildUrl(amount: number, apr: number, months: number) {
    return `${this.baseUrl}/${this.apiKey}/${apr}/${amount}/${months}`;
  }

  async getEstimates(amount: number, plans: AffirmPlan[]): Promise<AffirmEstimate[]> {
    return Promise.all(plans.map(async (plan) => {
      const url = this.buildUrl(amount, plan.apr, plan.months);
      const response = await fetch(url);
      const json = await response.json();
      return { ...json, apr: plan.apr, apr_string: json.apr };
    }));
  }
}
