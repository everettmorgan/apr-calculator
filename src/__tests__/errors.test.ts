import { describe, it, expect } from 'vitest';
import { InvalidEventError } from '../events/errors';
import { ViewEvents } from '../events/view-events';

describe('InvalidEventError', () => {
  it('is an instance of Error', () => {
    const err = new InvalidEventError(ViewEvents.PURCHASE_AMOUNT_CHANGED, '{}');
    expect(err).toBeInstanceOf(Error);
  });

  it('has name InvalidEventError', () => {
    const err = new InvalidEventError(ViewEvents.PURCHASE_AMOUNT_CHANGED, '{}');
    expect(err.name).toBe('InvalidEventError');
  });

  it('includes event type and data in message', () => {
    const err = new InvalidEventError(ViewEvents.SELECTED_APR_CHANGED, '{"bad":"data"}');
    expect(err.message).toContain('SELECTED_APR_CHANGED');
    expect(err.message).toContain('{"bad":"data"}');
  });
});
