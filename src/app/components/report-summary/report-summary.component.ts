import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RunwayMetrics, RunwayScenario } from '../../models/burn-rate.model';

@Component({
  selector: 'app-report-summary',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (scenario && metrics) {
      <div class="modal-backdrop" (click)="onBackdropClick($event)">
        <div class="audit-sheet animate-sheet-in" (click)="$event.stopPropagation()">
          <!-- Sheet Header -->
          <div class="sheet-header">
            <div class="header-watermark">
              <span class="sheet-icon">📜</span>
              <span class="sheet-title">EXECUTIVE RUNWAY & FREEDOM AUDIT</span>
            </div>
            <button type="button" class="close-btn" (click)="onClose()" title="Close Report">✕</button>
          </div>

          <!-- Sheet Body -->
          <div class="sheet-body">
            <!-- Verdict Banner -->
            <div class="verdict-banner" [ngClass]="metrics.isProfitable ? 'profitable' : 'deficit'">
              <div class="verdict-col">
                <span class="verdict-label">RUNWAY TRAJECTORY:</span>
                <span class="verdict-headline">
                  {{ metrics.isProfitable ? 'PROFITABLE / INFINITE RUNWAY' : metrics.runwayMonths.toFixed(1) + ' MONTHS' }}
                </span>
              </div>
              <div class="verdict-badge">
                <span>Score: {{ metrics.freedomScore }} / 100</span>
              </div>
            </div>

            <!-- Summary Table Grid -->
            <div class="summary-grid">
              <div class="summary-block">
                <span class="block-title">CAPITAL RESERVES:</span>
                <div class="data-row">
                  <span>Liquid Cash Reserves:</span>
                  <strong>{{ formatCurrency(scenario.savings) }}</strong>
                </div>
                <div class="data-row">
                  <span>Total Monthly Burn:</span>
                  <strong class="text-deficit">{{ formatCurrency(metrics.totalMonthlyBurn) }}/mo</strong>
                </div>
                <div class="data-row">
                  <span>Savings Multiple:</span>
                  <strong>{{ metrics.freedomMultiple | number:'1.1-1' }}x burn</strong>
                </div>
              </div>

              <div class="summary-block">
                <span class="block-title">INCOME VELOCITY:</span>
                <div class="data-row">
                  <span>Gross Monthly Earnings:</span>
                  <strong>{{ formatCurrency(metrics.monthlyTotalGross) }}/mo</strong>
                </div>
                <div class="data-row">
                  <span>Estimated Net (post-tax):</span>
                  <strong>{{ formatCurrency(metrics.monthlyNetIncome) }}/mo</strong>
                </div>
                <div class="data-row">
                  <span>Net Monthly Cashflow:</span>
                  <strong [ngClass]="metrics.netMonthlyCashFlow >= 0 ? 'text-surplus' : 'text-deficit'">
                    {{ metrics.netMonthlyCashFlow >= 0 ? '+' : '' }}{{ formatCurrency(metrics.netMonthlyCashFlow) }}/mo
                  </strong>
                </div>
              </div>
            </div>

            <!-- Share Link Row -->
            <div class="share-box">
              <span class="share-label">SHAREABLE SCENARIO LINK:</span>
              <div class="share-input-group">
                <input
                  type="text"
                  [value]="shareUrl"
                  readonly
                  class="share-link-input"
                />
                <button type="button" class="copy-link-btn" (click)="copyShareLink()">
                  @if (copied) {
                    <span>✓ Copied!</span>
                  } @else {
                    <span>📋 Copy Link</span>
                  }
                </button>
              </div>
              <span class="share-note">All parameters are encoded into the URL hash. No database or cookies required.</span>
            </div>
          </div>

          <!-- Sheet Footer Actions -->
          <div class="sheet-footer">
            <button type="button" class="print-btn" (click)="printReport()">
              🖨️ Print / Save PDF
            </button>
            <button type="button" class="done-btn" (click)="onClose()">
              Done
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(12, 10, 9, 0.85);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      z-index: 1000;
    }

    .audit-sheet {
      background: #fdfbf7;
      color: #292524;
      width: 100%;
      max-width: 600px;
      border-radius: 16px;
      box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(217, 119, 6, 0.3);
      position: relative;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }

    .sheet-header {
      background: #1c1917;
      color: #fafaf9;
      padding: 1rem 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2px solid #d97706;
    }

    .header-watermark {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }

    .sheet-icon {
      font-size: 1.2rem;
    }

    .sheet-title {
      font-size: 0.75rem;
      font-weight: 800;
      letter-spacing: 0.1em;
      color: #f59e0b;
    }

    .close-btn {
      background: rgba(255, 255, 255, 0.1);
      border: none;
      color: #a8a29e;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      cursor: pointer;
    }

    .close-btn:hover {
      color: #fafaf9;
      background: rgba(255, 255, 255, 0.2);
    }

    .sheet-body {
      padding: 1.75rem 2rem;
      max-height: 75vh;
      overflow-y: auto;
    }

    .verdict-banner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 1.25rem;
      border-radius: 10px;
      margin-bottom: 1.5rem;
    }

    .verdict-banner.profitable {
      background: #dcfce7;
      border: 1px solid #86efac;
      color: #14532d;
    }

    .verdict-banner.deficit {
      background: #fef3c7;
      border: 1px solid #fde68a;
      color: #78350f;
    }

    .verdict-col {
      display: flex;
      flex-direction: column;
    }

    .verdict-label {
      font-size: 0.65rem;
      font-weight: 800;
      letter-spacing: 0.08em;
    }

    .verdict-headline {
      font-size: 1.25rem;
      font-weight: 900;
      font-family: ui-serif, Georgia, serif;
    }

    .verdict-badge {
      font-size: 0.75rem;
      font-weight: 800;
      font-family: ui-monospace, monospace;
      background: rgba(0, 0, 0, 0.08);
      padding: 0.3rem 0.6rem;
      border-radius: 6px;
    }

    .summary-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.25rem;
      margin-bottom: 1.5rem;
    }

    @media (max-width: 520px) {
      .summary-grid {
        grid-template-columns: 1fr;
      }
    }

    .summary-block {
      background: #f5f5f4;
      border: 1px solid #e7e5e4;
      padding: 1rem;
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
    }

    .block-title {
      font-size: 0.68rem;
      font-weight: 800;
      letter-spacing: 0.08em;
      color: #78716c;
      margin-bottom: 0.25rem;
    }

    .data-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.8rem;
    }

    .data-row span {
      color: #57534e;
    }

    .data-row strong {
      font-family: ui-monospace, monospace;
      color: #1c1917;
    }

    .text-deficit { color: #dc2626 !important; }
    .text-surplus { color: #16a34a !important; }

    .share-box {
      background: #f5f5f4;
      border: 1px solid #e7e5e4;
      padding: 1.1rem;
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .share-label {
      font-size: 0.68rem;
      font-weight: 800;
      letter-spacing: 0.08em;
      color: #78716c;
    }

    .share-input-group {
      display: flex;
      gap: 0.5rem;
    }

    .share-link-input {
      flex: 1;
      background: #fff;
      border: 1px solid #d6d3d1;
      padding: 0.5rem 0.75rem;
      border-radius: 6px;
      font-size: 0.8rem;
      font-family: ui-monospace, monospace;
      color: #44403c;
    }

    .copy-link-btn {
      background: #d97706;
      border: none;
      color: #fff;
      padding: 0.5rem 0.95rem;
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 700;
      cursor: pointer;
      white-space: nowrap;
      transition: background 0.15s;
    }

    .copy-link-btn:hover {
      background: #b45309;
    }

    .share-note {
      font-size: 0.68rem;
      color: #78716c;
    }

    .sheet-footer {
      padding: 1rem 2rem 1.25rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #f5f5f4;
      border-top: 1px solid #e7e5e4;
    }

    .print-btn {
      background: #fff;
      border: 1px solid #d6d3d1;
      color: #44403c;
      padding: 0.55rem 1rem;
      border-radius: 6px;
      font-size: 0.82rem;
      font-weight: 600;
      cursor: pointer;
    }

    .done-btn {
      background: #292524;
      color: #fff;
      border: none;
      padding: 0.55rem 1.25rem;
      border-radius: 6px;
      font-size: 0.85rem;
      font-weight: 700;
      cursor: pointer;
    }

    @keyframes sheetIn {
      from { opacity: 0; transform: scale(0.95) translateY(10px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }

    .animate-sheet-in {
      animation: sheetIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }
  `]
})
export class ReportSummaryComponent {
  @Input() scenario: RunwayScenario | null = null;
  @Input() metrics: RunwayMetrics | null = null;
  @Input() shareUrl = '';

  @Output() close = new EventEmitter<void>();

  copied = false;

  @HostListener('window:keydown.escape')
  onEscape(): void {
    this.onClose();
  }

  onBackdropClick(event: MouseEvent): void {
    this.onClose();
  }

  onClose(): void {
    this.close.emit();
  }

  async copyShareLink(): Promise<void> {
    if (!this.shareUrl) return;
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(this.shareUrl);
        this.copied = true;
        setTimeout(() => {
          this.copied = false;
        }, 2000);
      }
    } catch {}
  }

  printReport(): void {
    if (typeof window !== 'undefined') {
      window.print();
    }
  }

  formatCurrency(val: number): string {
    if (val === undefined || val === null || isNaN(val)) return '$0';
    return `$${Math.round(val).toLocaleString()}`;
  }
}
