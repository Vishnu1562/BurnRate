import { describe, it, expect, beforeEach } from 'vitest';
import { RunwayDashboardComponent } from './runway-dashboard.component';
import { RunwayMetrics } from '../../models/burn-rate.model';

describe('RunwayDashboardComponent (TDD Specification)', () => {
  let component: RunwayDashboardComponent;

  const mockDeficitMetrics: RunwayMetrics = {
    totalMonthlyBurn: 4000,
    monthlyConsultingGross: 2167,
    monthlyTotalGross: 2167,
    effectiveTaxRate: 0.25,
    monthlyNetIncome: 1625,
    netMonthlyCashFlow: -2375,
    isProfitable: false,
    isBreakEven: false,
    runwayMonths: 12.6,
    projectedZeroDate: '2027-11-20T00:00:00Z',
    freedomScore: 42,
    freedomMultiple: 7.5
  };

  beforeEach(() => {
    component = new RunwayDashboardComponent();
    component.metrics = mockDeficitMetrics;
    component.savings = 30000;
  });

  describe('Formatting & Calculation Helpers', () => {
    it('should format runway headline for deficit mode', () => {
      expect(component.getRunwayHeadline()).toContain('12.6 MONTHS');
    });

    it('should format runway headline for profitable mode', () => {
      component.metrics = {
        ...mockDeficitMetrics,
        isProfitable: true,
        runwayMonths: Infinity,
        netMonthlyCashFlow: 3500
      };
      expect(component.getRunwayHeadline()).toContain('INFINITE RUNWAY');
    });

    it('should calculate balance scale tilt angle', () => {
      // Deficit: tilt towards expenses (negative angle)
      const deficitAngle = component.getBalanceTiltAngle();
      expect(deficitAngle).toBeLessThan(0);

      // Surplus: tilt towards income (positive angle)
      component.metrics = {
        ...mockDeficitMetrics,
        isProfitable: true,
        netMonthlyCashFlow: 3000
      };
      const surplusAngle = component.getBalanceTiltAngle();
      expect(surplusAngle).toBeGreaterThan(0);
    });

    it('should format currency values cleanly ($30,000, $4.2k, $1.2M)', () => {
      expect(component.formatCurrency(30000)).toBe('$30,000');
      expect(component.formatCurrency(1500000)).toBe('$1.5M');
      expect(component.formatCurrency(0)).toBe('$0');
    });
  });
});
