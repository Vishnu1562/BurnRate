import { Injectable } from '@angular/core';
import { RunwayMetrics, RunwayScenario } from '../models/burn-rate.model';

@Injectable({
  providedIn: 'root'
})
export class RunwayCalculatorService {
  private readonly WEEKS_PER_MONTH = 4.3333333333;
  private readonly TAX_RATE = 0.25; // Estimated 25% self-employment / income tax

  calculateMetrics(scenario: RunwayScenario): RunwayMetrics {
    const savings = Math.max(0, scenario.savings || 0);

    // Expenses (clamped non-negative)
    const exp = scenario.expenses || {};
    const housing = Math.max(0, exp.housing || 0);
    const living = Math.max(0, exp.living || 0);
    const tech = Math.max(0, exp.tech || 0);
    const healthTax = Math.max(0, exp.healthTax || 0);
    const discretionary = Math.max(0, exp.discretionary || 0);

    const totalMonthlyBurn = housing + living + tech + healthTax + discretionary;

    // Income (clamped non-negative)
    const inc = scenario.income || {};
    const hourlyRate = Math.max(0, inc.hourlyRate || 0);
    const weeklyBillableHours = Math.max(0, inc.weeklyBillableHours || 0);
    const monthlyRetainers = Math.max(0, inc.monthlyRetainers || 0);
    const passiveRevenue = Math.max(0, inc.passiveRevenue || 0);

    const monthlyConsultingGross = hourlyRate * weeklyBillableHours * this.WEEKS_PER_MONTH;
    const monthlyTotalGross = monthlyConsultingGross + monthlyRetainers + passiveRevenue;
    const monthlyNetIncome = monthlyTotalGross * (1 - this.TAX_RATE);

    const netMonthlyCashFlow = monthlyNetIncome - totalMonthlyBurn;
    const isBreakEven = Math.abs(netMonthlyCashFlow) < 1;
    const isProfitable = netMonthlyCashFlow > 0 && !isBreakEven;

    let runwayMonths = 0;
    let projectedZeroDate: string | null = null;

    if (isProfitable || isBreakEven) {
      runwayMonths = Infinity;
      projectedZeroDate = null;
    } else {
      if (savings <= 0) {
        runwayMonths = 0;
        projectedZeroDate = new Date().toISOString();
      } else {
        const monthlyDeficit = Math.abs(netMonthlyCashFlow);
        runwayMonths = monthlyDeficit > 0 ? savings / monthlyDeficit : Infinity;

        if (runwayMonths !== Infinity && !isNaN(runwayMonths)) {
          const daysRemaining = runwayMonths * 30.4375;
          const targetTime = Date.now() + daysRemaining * 24 * 3600 * 1000;
          projectedZeroDate = new Date(targetTime).toISOString();
        }
      }
    }

    const freedomMultiple = totalMonthlyBurn > 0 ? savings / totalMonthlyBurn : 999;

    let freedomScore = 0;
    if (isProfitable) {
      const surplusRatio = totalMonthlyBurn > 0 ? netMonthlyCashFlow / totalMonthlyBurn : 1;
      freedomScore = Math.min(100, Math.round(85 + Math.min(15, surplusRatio * 15)));
    } else if (isBreakEven) {
      freedomScore = 80;
    } else {
      if (runwayMonths > 0) {
        // Up to 24 months = 80 points
        freedomScore = Math.min(80, Math.round((runwayMonths / 24) * 80));
      } else {
        freedomScore = 0;
      }
    }

    return {
      totalMonthlyBurn,
      monthlyConsultingGross,
      monthlyTotalGross,
      effectiveTaxRate: this.TAX_RATE,
      monthlyNetIncome,
      netMonthlyCashFlow,
      isProfitable,
      isBreakEven,
      runwayMonths,
      projectedZeroDate,
      freedomScore,
      freedomMultiple
    };
  }
}
