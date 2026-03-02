export interface EventData {
  [key: string]: unknown;
}

export function emitEvent(this: Element, name: string, detail: EventData) {
  this.dispatchEvent(new CustomEvent(name, {
    detail,
    bubbles: true,
    composed: true,
  }));
}

export function dollarsTocents(dollars: number): number {
  return dollars * 100;
}

export function formatCents(cents: number): string {
  const sign = cents < 0 ? '-' : '';
  const abs = Math.abs(Number(cents));
  const dollars = Math.floor(abs / 100);
  const centsPart = String(abs % 100).padStart(2, '0');
  return `${sign}${dollars}.${centsPart}`;
}
