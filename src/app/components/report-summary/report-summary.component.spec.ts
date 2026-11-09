import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ReportSummaryComponent } from './report-summary.component';
import { RunwayMetrics, RunwayScenario } from '../../models/burn-rate.model';

describe('ReportSummaryComponent (TDD Specification)', () => {
  let component: ReportSummaryComponent;

  const mockScenario: RunwayScenario = {
    savings: 30000,
    expenses: { housing: 1800, living: 800, tech: 250, healthTax: 600, discretionary: 450 },
    income: { hourlyRate: 90, weeklyBillableHours: 20, monthlyRetainers: 1000, passiveRevenue: 200 },
    targetBufferMonths: 6
  };

  const mockMetrics: RunwayMetrics = {
    totalMonthlyBurn: 3900,
    monthlyConsultingGross: 7800,
    monthlyTotalGross: 9000,
    effectiveTaxRate: 0.25,
    monthlyNetIncome: 6750,
    netMonthlyCashFlow: 2850,
    isProfitable: true,
    isBreakEven: false,
    runwayMonths: Infinity,
    projectedZeroDate: null,
    freedomScore: 95,
    freedomMultiple: 7.7
  };

  beforeEach(() => {
    component = new ReportSummaryComponent();
    component.scenario = mockScenario;
    component.metrics = mockMetrics;
    component.shareUrl = 'https://burnrate.app/#c=abc123';
  });

  describe('HF-004: Copy Shareable Link', () => {
    it('should copy share URL to clipboard and show copied indicator', async () => {
      const writeTextMock = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: {
          writeText: writeTextMock
        }
      });

      await component.copyShareLink();
      expect(writeTextMock).toHaveBeenCalledWith('https://burnrate.app/#c=abc123');
      expect(component.copied).toBe(true);
    });

    it('should emit close when onClose is called', () => {
      let closeEmitted = false;
      component.close.subscribe(() => {
        closeEmitted = true;
      });

      component.onClose();
      expect(closeEmitted).toBe(true);
    });
  });
});
