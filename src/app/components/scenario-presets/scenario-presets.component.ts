import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScenarioPreset } from '../../models/burn-rate.model';

export const PRESET_SCENARIOS: ScenarioPreset[] = [
  {
    name: 'Quit & Freelance',
    badge: '💼 SOLO OPERATOR',
    description: 'Transition from full-time employee to solo contractor with 20 billable hours per week.',
    scenario: {
      savings: 25000,
      expenses: { housing: 1500, living: 700, tech: 200, healthTax: 500, discretionary: 300 },
      income: { hourlyRate: 90, weeklyBillableHours: 20, monthlyRetainers: 0, passiveRevenue: 0 },
      targetBufferMonths: 6
    }
  },
  {
    name: 'Bootstrap Founder',
    badge: '🚀 INDIE HACKER',
    description: 'Zero income, hyper-lean burn focused entirely on shipping an MVP before savings deplete.',
    scenario: {
      savings: 45000,
      expenses: { housing: 1200, living: 500, tech: 250, healthTax: 300, discretionary: 150 },
      income: { hourlyRate: 0, weeklyBillableHours: 0, monthlyRetainers: 0, passiveRevenue: 0 },
      targetBufferMonths: 12
    }
  },
  {
    name: 'Agency Consultant',
    badge: '🏢 HIGH VELOCITY',
    description: 'Premium client rates, multiple retainers, and expanded business expenses.',
    scenario: {
      savings: 60000,
      expenses: { housing: 2500, living: 1100, tech: 500, healthTax: 900, discretionary: 500 },
      income: { hourlyRate: 135, weeklyBillableHours: 32, monthlyRetainers: 2500, passiveRevenue: 500 },
      targetBufferMonths: 6
    }
  },
  {
    name: 'Digital Nomad',
    badge: '🌴 GEO-ARBITRAGE',
    description: 'Low-cost-of-living overseas lifestyle with moderate remote freelancing.',
    scenario: {
      savings: 18000,
      expenses: { housing: 800, living: 450, tech: 150, healthTax: 250, discretionary: 150 },
      income: { hourlyRate: 65, weeklyBillableHours: 20, monthlyRetainers: 500, passiveRevenue: 200 },
      targetBufferMonths: 9
    }
  }
];

@Component({
  selector: 'app-scenario-presets',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="presets-container">
      <div class="presets-header">
        <span class="header-label">CAREER TRANSITION ARCHETYPES:</span>
      </div>

      <div class="presets-grid">
        @for (preset of presets; track preset.name) {
          <div
            class="preset-card"
            [class.active]="activePresetName === preset.name"
            (click)="onChoosePreset(preset)"
          >
            <div class="card-badge">{{ preset.badge }}</div>
            <h4 class="card-title">{{ preset.name }}</h4>
            <p class="card-desc">{{ preset.description }}</p>

            <div class="preset-meta-row">
              <span class="meta-tag">\${{ preset.scenario.savings / 1000 }}k Cash</span>
              <span class="meta-tag">\${{ preset.scenario.income.hourlyRate }}/hr</span>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .presets-container {
      margin-bottom: 2rem;
    }

    .presets-header {
      margin-bottom: 0.75rem;
    }

    .header-label {
      font-size: 0.7rem;
      font-weight: 800;
      letter-spacing: 0.1em;
      color: #78716c;
    }

    .presets-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1rem;
    }

    .preset-card {
      background: rgba(28, 25, 23, 0.8);
      border: 1px solid #44403c;
      border-radius: 14px;
      padding: 1.1rem 1.25rem;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      transition: all 0.2s ease;
    }

    .preset-card:hover {
      border-color: #f59e0b;
      transform: translateY(-2px);
      box-shadow: 0 8px 20px -5px rgba(245, 158, 11, 0.2);
    }

    .preset-card.active {
      border-color: #f59e0b;
      background: rgba(41, 37, 36, 0.9);
      box-shadow: 0 0 0 1px #f59e0b;
    }

    .card-badge {
      font-size: 0.65rem;
      font-weight: 800;
      letter-spacing: 0.08em;
      color: #f59e0b;
      margin-bottom: 0.35rem;
    }

    .card-title {
      font-size: 1.1rem;
      font-weight: 800;
      color: #fafaf9;
      margin: 0 0 0.4rem 0;
      font-family: ui-serif, Georgia, serif;
    }

    .card-desc {
      font-size: 0.78rem;
      color: #a8a29e;
      line-height: 1.4;
      margin: 0 0 1rem 0;
      flex: 1;
    }

    .preset-meta-row {
      display: flex;
      gap: 0.5rem;
    }

    .meta-tag {
      background: #1c1917;
      border: 1px solid #44403c;
      padding: 0.2rem 0.55rem;
      border-radius: 6px;
      font-size: 0.72rem;
      font-family: ui-monospace, monospace;
      color: #d6d3d1;
      font-weight: 700;
    }
  `]
})
export class ScenarioPresetsComponent {
  @Input() activePresetName = 'Quit & Freelance';
  @Output() selectPreset = new EventEmitter<ScenarioPreset>();

  presets = PRESET_SCENARIOS;

  onChoosePreset(preset: ScenarioPreset): void {
    this.selectPreset.emit(preset);
  }
}
