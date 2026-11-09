import { describe, it, expect, beforeEach } from 'vitest';
import { RunwayCalculatorService } from './runway-calculator.service';
import { RunwayScenario } from '../models/burn-rate.model';

describe('RunwayCalculatorService (TDD Specification)', () => {
  let service: RunwayCalculatorService;

  beforeEach(() => {
    service = new RunwayCalculatorService();
  });

  const baseDeficitScenario: RunwayScenario = {
    savings: 30000,
    expenses: {
      housing: 1800,
      living: 800,
      tech: 300,
      healthTax: 600,
      discretionary: 500
    }, // total burn = 4000
    income: {
      hourlyRate: 50,
      weeklyBillableHours: 10,
      monthlyRetainers: 0,
      passiveRevenue: 0
    },
    targetBufferMonths: 6
  };

  describe('HF-001: Financial Runway Calculation in Deficit', () => {
    it('should calculate total monthly burn correctly', () => {
      const metrics = service.calculateMetrics(baseDeficitScenario);
      expect(metrics.totalMonthlyBurn).toBe(4000);
    });

    it('should compute gross income from weekly billable hours (4.333 weeks/mo)', () => {
      // 50/hr * 10 hrs * 4.333 = 2166.5
      const metrics = service.calculateMetrics(baseDeficitScenario);
      expect(Math.round(metrics.monthlyConsultingGross)).toBe(2167);
      expect(Math.round(metrics.monthlyTotalGross)).toBe(2167);
    });

    it('should calculate net cash flow deficit and exact runway months', () => {
      // Net income after ~25% tax = 2166.5 * 0.75 = 1624.875
      // Net deficit = 1624.875 - 4000 = -2375.125
      // Runway = 30000 / 2375.125 = ~12.6 months
      const metrics = service.calculateMetrics(baseDeficitScenario);
      expect(metrics.isProfitable).toBe(false);
      expect(metrics.isBreakEven).toBe(false);
      expect(metrics.runwayMonths).toBeCloseTo(12.6, 1);
      expect(metrics.projectedZeroDate).not.toBeNull();
    });
  });

  describe('HF-002: Profitability and Infinite Runway', () => {
    it('should flag profitable and return Infinite runway when net cashflow >= 0', () => {
      const profitableScenario: RunwayScenario = {
        savings: 25000,
        expenses: {
          housing: 1500,
          living: 600,
          tech: 200,
          healthTax: 500,
          discretionary: 400
        }, // total burn = 3200
        income: {
          hourlyRate: 100,
          weeklyBillableHours: 25, // 100 * 25 * 4.333 = 10832.5 gross -> 8124.3 net
          monthlyRetainers: 1000,
          passiveRevenue: 500
        },
        targetBufferMonths: 6
      };

      const metrics = service.calculateMetrics(profitableScenario);
      expect(metrics.isProfitable).toBe(true);
      expect(metrics.netMonthlyCashFlow).toBeGreaterThan(0);
      expect(metrics.runwayMonths).toBe(Infinity);
      expect(metrics.projectedZeroDate).toBeNull();
      expect(metrics.freedomScore).toBeGreaterThanOrEqual(85);
    });
  });

  describe('EC-001: Zero Savings and Zero Income Edge Case', () => {
    it('should safely return 0 runway months without NaN or division by zero crashes', () => {
      const brokeScenario: RunwayScenario = {
        savings: 0,
        expenses: {
          housing: 1200,
          living: 400,
          tech: 100,
          healthTax: 200,
          discretionary: 100
        },
        income: {
          hourlyRate: 0,
          weeklyBillableHours: 0,
          monthlyRetainers: 0,
          passiveRevenue: 0
        },
        targetBufferMonths: 6
      };

      const metrics = service.calculateMetrics(brokeScenario);
      expect(metrics.runwayMonths).toBe(0);
      expect(isNaN(metrics.runwayMonths)).toBe(false);
      expect(metrics.freedomScore).toBe(0);
    });
  });

  describe('EC-003: Break-Even Equilibrium Edge Case', () => {
    it('should detect break-even when net cashflow is near zero', () => {
      const breakEvenScenario: RunwayScenario = {
        savings: 10000,
        expenses: {
          housing: 1000,
          living: 500,
          tech: 0,
          healthTax: 0,
          discretionary: 0
        }, // total burn = 1500
        income: {
          hourlyRate: 0,
          weeklyBillableHours: 0,
          monthlyRetainers: 2000, // 2000 * 0.75 = 1500 net
          passiveRevenue: 0
        },
        targetBufferMonths: 6
      };

      const metrics = service.calculateMetrics(breakEvenScenario);
      expect(metrics.isBreakEven).toBe(true);
      expect(metrics.runwayMonths).toBe(Infinity);
    });
  });

  describe('VR-001 & VR-002: Numeric Clamping Safeguards', () => {
    it('should clamp negative values to zero', () => {
      const negativeScenario: RunwayScenario = {
        savings: -5000,
        expenses: {
          housing: -100,
          living: 500,
          tech: 0,
          healthTax: 0,
          discretionary: 0
        },
        income: {
          hourlyRate: -50,
          weeklyBillableHours: -10,
          monthlyRetainers: 0,
          passiveRevenue: 0
        },
        targetBufferMonths: 6
      };

      const metrics = service.calculateMetrics(negativeScenario);
      expect(metrics.totalMonthlyBurn).toBe(500);
      expect(metrics.monthlyTotalGross).toBe(0);
    });
  });
});
