import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RunwayMetrics } from '../../models/burn-rate.model';

@Component({
  selector: 'app-runway-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (metrics) {
      <div class="dashboard-card" [ngClass]="getThemeClass()">
        <!-- Status Header Badge -->
        <div class="dashboard-header">
          <div class="header-badge">
            <span class="badge-dot"></span>
            <span class="badge-text">{{ getTrajectoryLabel() }}</span>
          </div>

          <div class="freedom-score-pill" title="Financial Velocity Score (0–100)">
            <span class="score-label">VELOCITY SCORE:</span>
            <span class="score-val">{{ metrics.freedomScore }} / 100</span>
          </div>
        </div>

        <!-- Hero Runway Readout -->
        <div class="hero-readout">
          <h1 class="runway-headline">{{ getRunwayHeadline() }}</h1>
          <p class="runway-subtext">{{ getRunwaySubtext() }}</p>
        </div>

        <!-- Interactive SVG Balancing Scale -->
        <div class="scale-stage">
          <svg class="balance-svg" viewBox="0 0 460 160" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="goldBeamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#f59e0b" />
                <stop offset="50%" stop-color="#fbbf24" />
                <stop offset="100%" stop-color="#d97706" />
              </linearGradient>
            </defs>

            <!-- Fulcrum Base / Pillar -->
            <polygon points="230,95 215,145 245,145" fill="#44403c" stroke="#57534e" stroke-width="2" />
            <circle cx="230" cy="95" r="7" fill="#f59e0b" stroke="#78350f" stroke-width="2" />

            <!-- Tilting Balance Beam Group -->
            <g
              class="balance-beam"
              [style.transform]="'rotate(' + getBalanceTiltAngle() + 'deg)'"
              style="transform-origin: 230px 95px;"
            >
              <!-- Horizontal Beam -->
              <line x1="70" y1="95" x2="390" y2="95" stroke="url(#goldBeamGrad)" stroke-width="6" stroke-linecap="round" />

              <!-- Left Pan (Expenses) -->
              <g class="left-pan" transform="translate(70, 95)">
                <line x1="0" y1="0" x2="-20" y2="38" stroke="#78716c" stroke-width="1.5" />
                <line x1="0" y1="0" x2="20" y2="38" stroke="#78716c" stroke-width="1.5" />
                <!-- Pan dish -->
                <path d="M -30,38 Q 0,55 30,38 Z" fill="#292524" stroke="#f59e0b" stroke-width="2" />
                <text x="0" y="32" text-anchor="middle" class="pan-text expense-text">BURN</text>
                <text x="0" y="49" text-anchor="middle" class="pan-val">{{ formatCurrency(metrics.totalMonthlyBurn) }}</text>
              </g>

              <!-- Right Pan (Income) -->
              <g class="right-pan" transform="translate(390, 95)">
                <line x1="0" y1="0" x2="-20" y2="38" stroke="#78716c" stroke-width="1.5" />
                <line x1="0" y1="0" x2="20" y2="38" stroke="#78716c" stroke-width="1.5" />
                <!-- Pan dish -->
                <path d="M -30,38 Q 0,55 30,38 Z" fill="#292524" stroke="#10b981" stroke-width="2" />
                <text x="0" y="32" text-anchor="middle" class="pan-text income-text">NET INFLOW</text>
                <text x="0" y="49" text-anchor="middle" class="pan-val">{{ formatCurrency(metrics.monthlyNetIncome) }}</text>
              </g>
            </g>
          </svg>
        </div>

        <!-- 4 Key Metrics Bar -->
        <div class="metrics-grid">
          <!-- Net Cash Flow -->
          <div class="metric-card" [class.surplus]="metrics.netMonthlyCashFlow >= 0" [class.deficit]="metrics.netMonthlyCashFlow < 0">
            <span class="card-icon">{{ metrics.netMonthlyCashFlow >= 0 ? '📈' : '📉' }}</span>
            <div class="card-col">
              <span class="card-label">NET CASH FLOW</span>
              <span class="card-value">
                {{ metrics.netMonthlyCashFlow >= 0 ? '+' : '' }}{{ formatCurrency(metrics.netMonthlyCashFlow) }}
                <small>/mo</small>
              </span>
            </div>
          </div>

          <!-- Total Monthly Burn -->
          <div class="metric-card">
            <span class="card-icon">🔥</span>
            <div class="card-col">
              <span class="card-label">MONTHLY BURN</span>
              <span class="card-value">{{ formatCurrency(metrics.totalMonthlyBurn) }}<small>/mo</small></span>
            </div>
          </div>

          <!-- Gross Monthly Revenue -->
          <div class="metric-card">
            <span class="card-icon">💼</span>
            <div class="card-col">
              <span class="card-label">GROSS REVENUE</span>
              <span class="card-value">{{ formatCurrency(metrics.monthlyTotalGross) }}<small>/mo</small></span>
            </div>
          </div>

          <!-- Savings Multiple -->
          <div class="metric-card">
            <span class="card-icon">🛡️</span>
            <div class="card-col">
              <span class="card-label">SAVINGS BUFFER</span>
              <span class="card-value">{{ metrics.freedomMultiple | number:'1.1-1' }}x <small>burn</small></span>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .dashboard-card {
      background: linear-gradient(135deg, rgba(28, 25, 23, 0.95), rgba(41, 37, 36, 0.95));
      border: 1px solid rgba(217, 119, 6, 0.3);
      border-radius: 20px;
      padding: 2.25rem 2rem;
      backdrop-filter: blur(14px);
      box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.7);
      margin-bottom: 2rem;
      position: relative;
      transition: border-color 0.3s ease;
    }

    .dashboard-card.profitable {
      border-color: rgba(16, 185, 129, 0.4);
      box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.7), 0 0 25px rgba(16, 185, 129, 0.1);
    }

    .dashboard-header {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 1.25rem;
    }

    .header-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(245, 158, 11, 0.15);
      border: 1px solid rgba(245, 158, 11, 0.35);
      padding: 0.35rem 0.85rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 800;
      letter-spacing: 0.1em;
      color: #fbbf24;
    }

    .dashboard-card.profitable .header-badge {
      background: rgba(16, 185, 129, 0.15);
      border-color: rgba(16, 185, 129, 0.35);
      color: #34d399;
    }

    .badge-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: currentColor;
    }

    .freedom-score-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: #1c1917;
      border: 1px solid #44403c;
      padding: 0.35rem 0.85rem;
      border-radius: 8px;
      font-size: 0.78rem;
    }

    .score-label {
      font-weight: 700;
      color: #78716c;
    }

    .score-val {
      font-family: ui-monospace, monospace;
      font-weight: 800;
      color: #fef3c7;
    }

    .hero-readout {
      text-align: center;
      margin-bottom: 1.5rem;
    }

    .runway-headline {
      font-size: 2.8rem;
      font-weight: 900;
      letter-spacing: -0.03em;
      line-height: 1.1;
      margin: 0 0 0.5rem 0;
      background: linear-gradient(to right, #fef3c7, #f59e0b, #d97706);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-family: ui-serif, Georgia, serif;
    }

    .dashboard-card.profitable .runway-headline {
      background: linear-gradient(to right, #d1fae5, #34d399, #10b981);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .runway-subtext {
      font-size: 1rem;
      color: #a8a29e;
      margin: 0;
    }

    .scale-stage {
      display: flex;
      justify-content: center;
      margin-bottom: 2rem;
    }

    .balance-svg {
      width: 100%;
      max-width: 460px;
      height: 140px;
    }

    .balance-beam {
      transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .pan-text {
      font-size: 7.5px;
      font-weight: 800;
      letter-spacing: 0.08em;
      font-family: ui-monospace, monospace;
    }

    .expense-text { fill: #f87171; }
    .income-text { fill: #34d399; }

    .pan-val {
      font-size: 8px;
      font-weight: 700;
      fill: #fafaf9;
      font-family: ui-monospace, monospace;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .metric-card {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      background: #1c1917;
      border: 1px solid #44403c;
      padding: 0.9rem 1.1rem;
      border-radius: 12px;
      transition: all 0.15s ease;
    }

    .metric-card:hover {
      border-color: #f59e0b;
      transform: translateY(-1px);
    }

    .metric-card.surplus {
      border-color: rgba(16, 185, 129, 0.35);
    }

    .metric-card.surplus .card-value {
      color: #34d399;
    }

    .metric-card.deficit .card-value {
      color: #f87171;
    }

    .card-icon {
      font-size: 1.5rem;
    }

    .card-col {
      display: flex;
      flex-direction: column;
    }

    .card-label {
      font-size: 0.65rem;
      font-weight: 800;
      letter-spacing: 0.08em;
      color: #a8a29e;
    }

    .card-value {
      font-size: 1.35rem;
      font-weight: 800;
      color: #fafaf9;
      font-family: ui-monospace, monospace;
      line-height: 1.2;
      margin-top: 0.15rem;
    }

    .card-value small {
      font-size: 0.75rem;
      font-weight: 500;
      color: #78716c;
    }
  `]
})
export class RunwayDashboardComponent {
  @Input() metrics: RunwayMetrics | null = null;
  @Input() savings = 0;

  getRunwayHeadline(): string {
    if (!this.metrics) return '0.0 MONTHS';
    if (this.metrics.isProfitable) {
      return 'INFINITE RUNWAY';
    }
    if (this.metrics.isBreakEven) {
      return 'BREAK-EVEN (STEADY)';
    }
    return `${this.metrics.runwayMonths.toFixed(1)} MONTHS`;
  }

  getRunwaySubtext(): string {
    if (!this.metrics) return '';
    if (this.metrics.isProfitable) {
      return 'Net cash-positive trajectory. Savings buffer is growing each month.';
    }
    if (this.metrics.isBreakEven) {
      return 'Zero monthly depletion. Revenue cleanly balances burn.';
    }
    if (this.metrics.runwayMonths === 0) {
      return 'Critical zero-capital threshold. Immediate revenue required.';
    }
    if (this.metrics.projectedZeroDate) {
      const d = new Date(this.metrics.projectedZeroDate);
      const dateStr = d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
      return `Estimated capital exhaustion date: ${dateStr}`;
    }
    return '';
  }

  getTrajectoryLabel(): string {
    if (!this.metrics) return 'FINANCIAL TRAJECTORY';
    if (this.metrics.isProfitable) return 'PROSPERITY / FREEDOM ACCELERATION';
    if (this.metrics.isBreakEven) return 'EQUILIBRIUM PRESERVATION';
    if (this.metrics.runwayMonths > 12) return 'STABLE RUNWAY EXTENSION';
    if (this.metrics.runwayMonths > 6) return 'MODERATE BURNDOWN VELOCITY';
    return 'CRITICAL BURNDOWN WARNING';
  }

  getThemeClass(): string {
    if (!this.metrics) return '';
    if (this.metrics.isProfitable) return 'profitable';
    if (this.metrics.isBreakEven) return 'breakeven';
    return 'deficit';
  }

  getBalanceTiltAngle(): number {
    if (!this.metrics) return 0;
    if (this.metrics.isBreakEven) return 0;

    const net = this.metrics.netMonthlyCashFlow;
    const burn = Math.max(1000, this.metrics.totalMonthlyBurn);

    // Max tilt = 12 degrees
    const ratio = net / burn;
    const clampedRatio = Math.max(-1, Math.min(1, ratio));
    return clampedRatio * 12;
  }

  formatCurrency(val: number): string {
    if (val === undefined || val === null || isNaN(val)) return '$0';
    const isNeg = val < 0;
    const absVal = Math.abs(val);

    let formatted = '';
    if (absVal >= 1000000) {
      formatted = `$${(absVal / 1000000).toFixed(1)}M`;
    } else {
      formatted = `$${Math.round(absVal).toLocaleString()}`;
    }

    return isNeg ? `-${formatted}` : formatted;
  }
}
