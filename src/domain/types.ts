export interface Plan {
  apr: number;
  months: number;
}

export interface Estimate {
  apr: number;
  aprString: string;
  disclosure: string;
  months: number;
  payment: number;
  paymentString: string;
}
