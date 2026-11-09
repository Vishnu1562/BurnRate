export interface ExpenseBreakdown {
  housing: number;
  living: number;
  tech: number;
  healthTax: number;
  discretionary: number;
}

export interface IncomeBreakdown {
  hourlyRate: number;
  weeklyBillableHours: number;
  monthlyRetainers: number;
  passiveRevenue: number;
}

export interface RunwayScenario {
  savings: number;
  expenses: ExpenseBreakdown;
  income: IncomeBreakdown;
  targetBufferMonths: number;
}

export interface RunwayMetrics {
  totalMonthlyBurn: number;
  monthlyConsultingGross: number;
  monthlyTotalGross: number;
  effectiveTaxRate: number;
  monthlyNetIncome: number;
  netMonthlyCashFlow: number;
  isProfitable: boolean;
  isBreakEven: boolean;
  runwayMonths: number;
  projectedZeroDate: string | null; // ISO Date String
  freedomScore: number; // 0 to 100
  freedomMultiple: number; // savings / burn
}

export interface ScenarioPreset {
  name: string;
  badge: string;
  description: string;
  scenario: RunwayScenario;
}
