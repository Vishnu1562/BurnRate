import { describe, it, expect, beforeEach } from 'vitest';
import { IncomeControlsComponent } from './income-controls.component';
import { IncomeBreakdown } from '../../models/burn-rate.model';

describe('IncomeControlsComponent (TDD Specification)', () => {
  let component: IncomeControlsComponent;

  const mockIncome: IncomeBreakdown = {
    hourlyRate: 90,
    weeklyBillableHours: 20,
    monthlyRetainers: 1000,
    passiveRevenue: 200
  };

  beforeEach(() => {
    component = new IncomeControlsComponent();
    component.income = { ...mockIncome };
  });

  describe('User Interactions & Emits', () => {
    it('should emit incomeChange when hourly rate is adjusted', () => {
      let updatedIncome: any = null;
      component.incomeChange.subscribe((val) => {
        updatedIncome = val;
      });

      component.onIncomeUpdate('hourlyRate', 125);
      expect(updatedIncome.hourlyRate).toBe(125);
      expect(updatedIncome.weeklyBillableHours).toBe(20);
    });

    it('should calculate estimated monthly gross revenue correctly', () => {
      // 90 * 20 * 4.333 + 1000 + 200 = 7800 + 1200 = ~9000
      const monthly = component.calculateMonthlyEquivalent();
      expect(Math.round(monthly)).toBe(9000);
    });

    it('should clamp negative values to 0', () => {
      let updatedIncome: any = null;
      component.incomeChange.subscribe((val) => {
        updatedIncome = val;
      });

      component.onIncomeUpdate('weeklyBillableHours', -5);
      expect(updatedIncome.weeklyBillableHours).toBe(0);
    });
  });
});
