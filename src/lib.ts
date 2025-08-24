import _ from 'lodash';

export function type(value: any): string {
  if (_.isString(value)) return 'string';
  if (_.isNumber(value)) return 'number';
  if (_.isObject(value)) return 'object';
  if (_.isArray(value)) return 'array';
  return 'unknown';
}

export interface KV {
  [key: string]: any;
}

export const noop = () => {};

export function emitEvent(this: Element, name: string, detail: KV) {
  this.dispatchEvent(new CustomEvent(name, {
    detail,
    bubbles: true,
    composed: true,
  }));
}

export function formatCents(cents: number) {
  const sign = cents < 0 ? '-' : '';
  const abs = Math.abs(Number(cents));
  const dollars = Math.floor(abs / 100);
  const centsPart = String(abs % 100).padStart(2, '0');
  return `${sign}${dollars}.${centsPart}`;
}
