import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IncomeBreakdown } from '../../models/burn-rate.model';

@Component({
  selector: 'app-income-controls',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="control-panel-card">
      <div class="panel-header">
        <div class="header-left">
          <span class="panel-badge">💰 REVENUE & BILLABLE POWER</span>
          <h3 class="panel-title">Income Streams & Rates</h3>
        </div>
        <div class="gross-summary-pill">
          <span class="pill-label">EST. GROSS:</span>
          <span class="pill-val">{{ formatCurrency(calculateMonthlyEquivalent()) }}/mo</span>
        </div>
      </div>

      <!-- Categories List -->
      <div class="categories-list">
        <!-- Hourly Rate -->
        <div class="category-item">
          <div class="cat-label-row">
            <span class="cat-name">⏱️ Hourly Consulting Rate</span>
            <span class="cat-val">\${{ income.hourlyRate }}/hr</span>
          </div>
          <input
            type="range"
            min="0"
            max="300"
            step="5"
            [ngModel]="income.hourlyRate"
            (ngModelChange)="onIncomeUpdate('hourlyRate', $event)"
            class="custom-slider income-slider"
          />
        </div>

        <!-- Weekly Billable Hours -->
        <div class="category-item">
          <div class="cat-label-row">
            <span class="cat-name">📅 Billable Hours per Week</span>
            <span class="cat-val">{{ income.weeklyBillableHours }} hrs/wk</span>
          </div>
          <input
            type="range"
            min="0"
            max="50"
            step="1"
            [ngModel]="income.weeklyBillableHours"
            (ngModelChange)="onIncomeUpdate('weeklyBillableHours', $event)"
            class="custom-slider income-slider"
          />
        </div>

        <!-- Monthly Retainers -->
        <div class="category-item">
          <div class="cat-label-row">
            <span class="cat-name">🤝 Monthly Client Retainers</span>
            <span class="cat-val">{{ formatCurrency(income.monthlyRetainers) }}/mo</span>
          </div>
          <input
            type="range"
            min="0"
            max="12000"
            step="250"
            [ngModel]="income.monthlyRetainers"
            (ngModelChange)="onIncomeUpdate('monthlyRetainers', $event)"
            class="custom-slider income-slider"
          />
        </div>

        <!-- Passive Revenue -->
        <div class="category-item">
          <div class="cat-label-row">
            <span class="cat-name">📦 Side Projects & Passive Products</span>
            <span class="cat-val">{{ formatCurrency(income.passiveRevenue) }}/mo</span>
          </div>
          <input
            type="range"
            min="0"
            max="8000"
            step="100"
            [ngModel]="income.passiveRevenue"
            (ngModelChange)="onIncomeUpdate('passiveRevenue', $event)"
            class="custom-slider income-slider"
          />
        </div>
      </div>
    </div>
  `,
  styles: [`
    .control-panel-card {
      background: rgba(24, 20, 16, 0.85);
      border: 1px solid rgba(217, 119, 6, 0.25);
      border-radius: 20px;
      padding: 1.75rem 2rem;
      backdrop-filter: blur(14px);
      box-shadow: 0 15px 35px -10px rgba(0, 0, 0, 0.7);
      margin-bottom: 2rem;
    }

    .panel-header {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 1.75rem;
    }

    .panel-badge {
      font-size: 0.7rem;
      font-weight: 800;
      letter-spacing: 0.1em;
      color: #10b981;
      display: block;
      margin-bottom: 0.25rem;
    }

    .panel-title {
      font-size: 1.35rem;
      font-weight: 800;
      color: #fafaf9;
      margin: 0;
      font-family: ui-serif, Georgia, serif;
    }

    .gross-summary-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.35);
      padding: 0.35rem 0.85rem;
      border-radius: 9999px;
      font-size: 0.78rem;
    }

    .pill-label {
      color: #a8a29e;
      font-weight: 700;
    }

    .pill-val {
      color: #34d399;
      font-family: ui-monospace, monospace;
      font-weight: 800;
    }

    .categories-list {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .category-item {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    .cat-label-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .cat-name {
      font-size: 0.85rem;
      font-weight: 700;
      color: #e7e5e4;
    }

    .cat-val {
      font-size: 0.85rem;
      font-family: ui-monospace, monospace;
      font-weight: 700;
      color: #34d399;
    }

    .custom-slider {
      width: 100%;
      height: 6px;
      accent-color: #10b981;
      cursor: pointer;
    }
  `]
})
export class IncomeControlsComponent {
  @Input() income: IncomeBreakdown = {
    hourlyRate: 90,
    weeklyBillableHours: 20,
    monthlyRetainers: 1000,
    passiveRevenue: 200
  };

  @Output() incomeChange = new EventEmitter<IncomeBreakdown>();
  @Output() sliderInteract = new EventEmitter<void>();

  calculateMonthlyEquivalent(): number {
    const consulting = this.income.hourlyRate * this.income.weeklyBillableHours * 4.3333333333;
    return consulting + this.income.monthlyRetainers + this.income.passiveRevenue;
  }

  onIncomeUpdate(field: keyof IncomeBreakdown, val: number): void {
    const clamped = Math.max(0, Number(val));
    const nextIncome: IncomeBreakdown = {
      ...this.income,
      [field]: clamped
    };
    this.income = nextIncome;
    this.incomeChange.emit(nextIncome);
    this.sliderInteract.emit();
  }

  formatCurrency(val: number): string {
    if (val === undefined || val === null || isNaN(val)) return '$0';
    return `$${Math.round(val).toLocaleString()}`;
  }
}
