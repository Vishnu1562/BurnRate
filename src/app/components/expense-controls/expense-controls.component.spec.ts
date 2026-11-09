import { describe, it, expect, beforeEach } from 'vitest';
import { ExpenseControlsComponent } from './expense-controls.component';
import { ExpenseBreakdown } from '../../models/burn-rate.model';

describe('ExpenseControlsComponent (TDD Specification)', () => {
  let component: ExpenseControlsComponent;

  const mockExpenses: ExpenseBreakdown = {
    housing: 1800,
    living: 800,
    tech: 250,
    healthTax: 600,
    discretionary: 450
  };

  beforeEach(() => {
    component = new ExpenseControlsComponent();
    component.savings = 30000;
    component.expenses = { ...mockExpenses };
  });

  describe('User Interactions & Emits', () => {
    it('should emit savingsChange when savings is updated', () => {
      let updatedSavings = 0;
      component.savingsChange.subscribe((val) => {
        updatedSavings = val;
      });

      component.onSavingsUpdate(45000);
      expect(updatedSavings).toBe(45000);
    });

    it('should emit expenseChange when any expense category is updated', () => {
      let updatedExpenses: any = null;
      component.expenseChange.subscribe((val) => {
        updatedExpenses = val;
      });

      component.onExpenseUpdate('housing', 2200);
      expect(updatedExpenses.housing).toBe(2200);
      expect(updatedExpenses.living).toBe(800);
    });

    it('should clamp negative values to 0', () => {
      let updatedExpenses: any = null;
      component.expenseChange.subscribe((val) => {
        updatedExpenses = val;
      });

      component.onExpenseUpdate('tech', -50);
      expect(updatedExpenses.tech).toBe(0);
    });
  });
});
