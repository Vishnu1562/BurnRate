import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpenseBreakdown } from '../../models/burn-rate.model';

@Component({
  selector: 'app-expense-controls',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="control-panel-card">
      <div class="panel-header">
        <span class="panel-badge">🏦 OUTFLOW & CAPITAL</span>
        <h3 class="panel-title">War Chest & Monthly Expenses</h3>
      </div>

      <!-- Liquid Savings Hero Field -->
      <div class="savings-hero-block">
        <div class="field-label-row">
          <label class="field-label">LIQUID SAVINGS / RUNWAY BUFFER</label>
          <span class="field-val">{{ formatCurrency(savings) }}</span>
        </div>
        <input
          type="range"
          min="0"
          max="200000"
          step="1000"
          [ngModel]="savings"
          (ngModelChange)="onSavingsUpdate($event)"
          class="custom-slider savings-slider"
        />
        <div class="quick-step-row">
          <button type="button" class="step-chip" (click)="onSavingsUpdate(10000)">$10k</button>
          <button type="button" class="step-chip" (click)="onSavingsUpdate(25000)">$25k</button>
          <button type="button" class="step-chip" (click)="onSavingsUpdate(50000)">$50k</button>
          <button type="button" class="step-chip" (click)="onSavingsUpdate(100000)">$100k</button>
        </div>
      </div>

      <!-- Expense Categories List -->
      <div class="categories-list">
        <!-- Housing -->
        <div class="category-item">
          <div class="cat-label-row">
            <span class="cat-name">🏠 Housing & Rent</span>
            <span class="cat-val">{{ formatCurrency(expenses.housing) }}/mo</span>
          </div>
          <input
            type="range"
            min="0"
            max="8000"
            step="50"
            [ngModel]="expenses.housing"
            (ngModelChange)="onExpenseUpdate('housing', $event)"
            class="custom-slider"
          />
        </div>

        <!-- Food & Living -->
        <div class="category-item">
          <div class="cat-label-row">
            <span class="cat-name">🛒 Food, Groceries & Utilities</span>
            <span class="cat-val">{{ formatCurrency(expenses.living) }}/mo</span>
          </div>
          <input
            type="range"
            min="0"
            max="3000"
            step="25"
            [ngModel]="expenses.living"
            (ngModelChange)="onExpenseUpdate('living', $event)"
            class="custom-slider"
          />
        </div>

        <!-- SaaS & Tech Tools -->
        <div class="category-item">
          <div class="cat-label-row">
            <span class="cat-name">💻 SaaS, Cloud & Tech Subscriptions</span>
            <span class="cat-val">{{ formatCurrency(expenses.tech) }}/mo</span>
          </div>
          <input
            type="range"
            min="0"
            max="1500"
            step="25"
            [ngModel]="expenses.tech"
            (ngModelChange)="onExpenseUpdate('tech', $event)"
            class="custom-slider"
          />
        </div>

        <!-- Health Insurance & Taxes -->
        <div class="category-item">
          <div class="cat-label-row">
            <span class="cat-name">🩺 Healthcare & Self-Employed Tax Buffer</span>
            <span class="cat-val">{{ formatCurrency(expenses.healthTax) }}/mo</span>
          </div>
          <input
            type="range"
            min="0"
            max="2500"
            step="25"
            [ngModel]="expenses.healthTax"
            (ngModelChange)="onExpenseUpdate('healthTax', $event)"
            class="custom-slider"
          />
        </div>

        <!-- Discretionary -->
        <div class="category-item">
          <div class="cat-label-row">
            <span class="cat-name">☕ Discretionary & Lifestyle</span>
            <span class="cat-val">{{ formatCurrency(expenses.discretionary) }}/mo</span>
          </div>
          <input
            type="range"
            min="0"
            max="2500"
            step="25"
            [ngModel]="expenses.discretionary"
            (ngModelChange)="onExpenseUpdate('discretionary', $event)"
            class="custom-slider"
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
      margin-bottom: 1.5rem;
    }

    .panel-badge {
      font-size: 0.7rem;
      font-weight: 800;
      letter-spacing: 0.1em;
      color: #f59e0b;
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

    .savings-hero-block {
      background: #141210;
      border: 1px solid #44403c;
      border-radius: 14px;
      padding: 1.25rem;
      margin-bottom: 1.75rem;
    }

    .field-label-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }

    .field-label {
      font-size: 0.72rem;
      font-weight: 800;
      letter-spacing: 0.08em;
      color: #a8a29e;
    }

    .field-val {
      font-size: 1.4rem;
      font-weight: 800;
      font-family: ui-monospace, monospace;
      color: #fbbf24;
    }

    .quick-step-row {
      display: flex;
      gap: 0.5rem;
      margin-top: 0.75rem;
    }

    .step-chip {
      background: #292524;
      border: 1px solid #44403c;
      color: #d6d3d1;
      padding: 0.25rem 0.65rem;
      border-radius: 6px;
      font-size: 0.75rem;
      font-family: ui-monospace, monospace;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.15s;
    }

    .step-chip:hover {
      border-color: #f59e0b;
      color: #fbbf24;
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
      color: #fca5a5;
    }

    .custom-slider {
      width: 100%;
      height: 6px;
      accent-color: #f59e0b;
      cursor: pointer;
    }

    .savings-slider {
      height: 8px;
      accent-color: #fbbf24;
    }
  `]
})
export class ExpenseControlsComponent {
  @Input() savings = 30000;
  @Input() expenses: ExpenseBreakdown = {
    housing: 1800,
    living: 800,
    tech: 250,
    healthTax: 600,
    discretionary: 450
  };

  @Output() savingsChange = new EventEmitter<number>();
  @Output() expenseChange = new EventEmitter<ExpenseBreakdown>();
  @Output() sliderInteract = new EventEmitter<void>();

  onSavingsUpdate(val: number): void {
    const clamped = Math.max(0, Number(val));
    this.savings = clamped;
    this.savingsChange.emit(clamped);
    this.sliderInteract.emit();
  }

  onExpenseUpdate(category: keyof ExpenseBreakdown, val: number): void {
    const clamped = Math.max(0, Number(val));
    const nextExpenses: ExpenseBreakdown = {
      ...this.expenses,
      [category]: clamped
    };
    this.expenses = nextExpenses;
    this.expenseChange.emit(nextExpenses);
    this.sliderInteract.emit();
  }

  formatCurrency(val: number): string {
    if (val === undefined || val === null || isNaN(val)) return '$0';
    return `$${Math.round(val).toLocaleString()}`;
  }
}
