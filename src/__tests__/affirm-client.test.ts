import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AffirmEstimateService } from '../affirm.client';
import { Plan } from '../domain/types';

describe('AffirmEstimateService', () => {
  const apiKey = 'TEST_KEY';
  let service: AffirmEstimateService;

  beforeEach(() => {
    service = new AffirmEstimateService(apiKey);
    vi.restoreAllMocks();
  });

  it('constructs correct URL', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ apr: '10', disclosure: 'test', months: 12, payment: 13198, payment_string: '131.98' }),
    });
    vi.stubGlobal('fetch', mockFetch);

    await service.getEstimates(150000, [{ apr: 0.10, months: 12 }]);

    expect(mockFetch).toHaveBeenCalledWith(
      'https://calculator.affirm.com/promos/payment_estimate_path/TEST_KEY/0.1/150000/12',
    );
  });

  it('maps snake_case response to camelCase Estimate', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        apr: '10.12',
        disclosure: 'Based on $1500 at 10% APR',
        months: 12,
        payment: 13198,
        payment_string: '131.98',
      }),
    }));

    const [estimate] = await service.getEstimates(150000, [{ apr: 0.10, months: 12 }]);

    expect(estimate.apr).toBe(0.10);
    expect(estimate.aprString).toBe('10.12');
    expect(estimate.paymentString).toBe('131.98');
    expect(estimate.disclosure).toBe('Based on $1500 at 10% APR');
    expect(estimate.months).toBe(12);
    expect(estimate.payment).toBe(13198);
  });

  it('fetches all plans in parallel', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ apr: '10', disclosure: 'test', months: 12, payment: 100, payment_string: '1' }),
    });
    vi.stubGlobal('fetch', mockFetch);

    const plans: Plan[] = [
      { apr: 0.10, months: 12 },
      { apr: 0.20, months: 24 },
      { apr: 0.30, months: 36 },
    ];

    const estimates = await service.getEstimates(150000, plans);

    expect(mockFetch).toHaveBeenCalledTimes(3);
    expect(estimates).toHaveLength(3);
  });

  it('throws on non-ok response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    }));

    await expect(service.getEstimates(150000, [{ apr: 0.10, months: 12 }]))
      .rejects.toThrow('Affirm API error: 500 Internal Server Error');
  });

  it('throws on network failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

    await expect(service.getEstimates(150000, [{ apr: 0.10, months: 12 }]))
      .rejects.toThrow('Network error');
  });
});
