import {
  describe, it, expect, vi, beforeEach,
} from 'vitest';
import { CalculatorController } from '../controller';
import {
  ICalculatorModel, ICalculatorView, IEstimateService, ViewMountOptions,
} from '../domain/ports';
import { Estimate, Plan } from '../domain/types';
import { ViewEvents } from '../events/view-events';
import { InvalidEventError } from '../events/errors';

function makeEstimate(apr: number, months: number): Estimate {
  return {
    apr,
    aprString: String(apr * 100),
    disclosure: `Test ${apr} ${months}`,
    months,
    payment: 13198,
    paymentString: '131.98',
  };
}

function createMockModel(): ICalculatorModel {
  let purchaseAmount = 0;
  let selectedApr = 0;
  let plans: Plan[] = [];
  let estimates: Estimate[] = [];

  return {
    getPurchaseAmount: vi.fn(() => purchaseAmount),
    setPurchaseAmount: vi.fn((a: number) => { purchaseAmount = a; }),
    getSelectedApr: vi.fn(() => selectedApr),
    setSelectedApr: vi.fn((a: number) => { selectedApr = a; }),
    getPlans: vi.fn(() => [...plans]),
    setPlans: vi.fn((p: Plan[]) => { plans = p; }),
    getEstimates: vi.fn(() => estimates),
    getEstimatesForSelectedApr: vi.fn(() => estimates.filter((e) => e.apr === selectedApr)),
    setEstimates: vi.fn((e: Estimate[]) => { estimates = e; }),
  };
}

function createMockView(): ICalculatorView {
  return {
    mount: vi.fn(),
    updateState: vi.fn(),
  };
}

function createMockEstimateService(estimates: Estimate[] = []): IEstimateService {
  return {
    getEstimates: vi.fn().mockResolvedValue(estimates),
  };
}

const plans: Plan[] = [
  { apr: 0.10, months: 12 },
  { apr: 0.20, months: 24 },
];

const allEstimates: Estimate[] = [
  makeEstimate(0.10, 12),
  makeEstimate(0.20, 24),
];

function getMountArgs(view: ICalculatorView): ViewMountOptions {
  const mock = view.mount as ReturnType<typeof vi.fn>;
  return mock.mock.calls[0][0] as ViewMountOptions;
}

describe('CalculatorController', () => {
  let model: ICalculatorModel;
  let view: ICalculatorView;
  let estimateService: IEstimateService;
  let controller: CalculatorController;

  beforeEach(() => {
    model = createMockModel();
    view = createMockView();
    estimateService = createMockEstimateService(allEstimates);
    // Construct without DI — pass mocks directly
    controller = new (CalculatorController as any)(model, view, estimateService);
  });

  describe('initialize', () => {
    it('calls estimateService.getEstimates with cents amount', async () => {
      await controller.initialize({ plans, initialPurchaseAmount: 1500, initialSelectedApr: 0.10 });
      expect(estimateService.getEstimates).toHaveBeenCalledWith(150000, plans);
    });

    it('sets model initial state', async () => {
      await controller.initialize({ plans, initialPurchaseAmount: 1500, initialSelectedApr: 0.10 });
      expect(model.setPurchaseAmount).toHaveBeenCalledWith(1500);
      expect(model.setSelectedApr).toHaveBeenCalledWith(0.10);
      expect(model.setPlans).toHaveBeenCalledWith(plans);
    });

    it('stores estimates in model', async () => {
      await controller.initialize({ plans, initialPurchaseAmount: 1500, initialSelectedApr: 0.10 });
      expect(model.setEstimates).toHaveBeenCalledWith(allEstimates);
    });

    it('calls view.mount with filtered estimates for selected APR', async () => {
      await controller.initialize({ plans, initialPurchaseAmount: 1500, initialSelectedApr: 0.10 });
      expect(view.mount).toHaveBeenCalledTimes(1);
      const mountArgs = getMountArgs(view);
      expect(mountArgs.purchaseAmount).toBe(1500);
      expect(mountArgs.selectedApr).toBe(0.10);
      expect(mountArgs.plans).toEqual(plans);
    });

    it('passes viewConfig to view.mount', async () => {
      await controller.initialize(
        { plans, initialPurchaseAmount: 1500, initialSelectedApr: 0.10 },
        { title: 'My Title', color: '#000' },
      );
      const mountArgs = getMountArgs(view);
      expect(mountArgs.title).toBe('My Title');
      expect(mountArgs.color).toBe('#000');
    });
  });

  describe('event dispatch', () => {
    let onEvent: (event: ViewEvents, data: Record<string, unknown>) => void;

    beforeEach(async () => {
      await controller.initialize({ plans, initialPurchaseAmount: 1500, initialSelectedApr: 0.10 });
      const mountArgs = getMountArgs(view);
      onEvent = mountArgs.onEvent;
    });

    it('PURCHASE_AMOUNT_CHANGED updates model and view', () => {
      onEvent(ViewEvents.PURCHASE_AMOUNT_CHANGED, { amount: 2000 });
      expect(model.setPurchaseAmount).toHaveBeenCalledWith(2000);
      expect(view.updateState).toHaveBeenCalledWith({ purchaseAmount: 2000 });
    });

    it('PURCHASE_AMOUNT_CHANGED triggers new estimate fetch', async () => {
      onEvent(ViewEvents.PURCHASE_AMOUNT_CHANGED, { amount: 2000 });
      // Wait for the async .then() to resolve
      await vi.waitFor(() => {
        expect(estimateService.getEstimates).toHaveBeenCalledTimes(2);
      });
    });

    it('SELECTED_APR_CHANGED updates model and view with filtered estimates', () => {
      onEvent(ViewEvents.SELECTED_APR_CHANGED, { selectedApr: 0.20 });
      expect(model.setSelectedApr).toHaveBeenCalledWith(0.20);
      expect(view.updateState).toHaveBeenCalledWith(
        expect.objectContaining({ selectedApr: 0.20 }),
      );
    });

    it('unknown event logs warning and does not throw', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      expect(() => onEvent('UNKNOWN_EVENT' as ViewEvents, {})).not.toThrow();
      expect(warnSpy).toHaveBeenCalled();
      warnSpy.mockRestore();
    });

    it('invalid PURCHASE_AMOUNT_CHANGED data throws InvalidEventError', () => {
      expect(() => onEvent(ViewEvents.PURCHASE_AMOUNT_CHANGED, { amount: 'not-a-number' }))
        .toThrow(InvalidEventError);
    });

    it('invalid SELECTED_APR_CHANGED data throws InvalidEventError', () => {
      expect(() => onEvent(ViewEvents.SELECTED_APR_CHANGED, {}))
        .toThrow(InvalidEventError);
    });
  });
});
