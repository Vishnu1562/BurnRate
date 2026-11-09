import { Component, OnInit, HostListener, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import confetti from 'canvas-confetti';
import { RunwayScenario, ExpenseBreakdown, IncomeBreakdown, ScenarioPreset, RunwayMetrics } from './models/burn-rate.model';
import { RunwayCalculatorService } from './services/runway-calculator.service';
import { UrlStateService, DEFAULT_SCENARIO } from './services/url-state.service';
import { AudioFeedbackService } from './services/audio-feedback.service';
import { RunwayDashboardComponent } from './components/runway-dashboard/runway-dashboard.component';
import { ExpenseControlsComponent } from './components/expense-controls/expense-controls.component';
import { IncomeControlsComponent } from './components/income-controls/income-controls.component';
import { ScenarioPresetsComponent } from './components/scenario-presets/scenario-presets.component';
import { ReportSummaryComponent } from './components/report-summary/report-summary.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RunwayDashboardComponent,
    ExpenseControlsComponent,
    IncomeControlsComponent,
    ScenarioPresetsComponent,
    ReportSummaryComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent implements OnInit {
  scenario = signal<RunwayScenario>(DEFAULT_SCENARIO);
  activePresetName = signal<string>('Quit & Freelance');
  showReportModal = signal<boolean>(false);
  audioMuted = signal<boolean>(false);
  copiedFeedback = signal<boolean>(false);

  metrics = computed<RunwayMetrics>(() => {
    return this.calculator.calculateMetrics(this.scenario());
  });

  shareUrl = computed<string>(() => {
    return this.urlState.generateShareUrl(this.scenario());
  });

  private previousProfitable = false;

  constructor(
    public calculator: RunwayCalculatorService,
    public urlState: UrlStateService,
    public audio: AudioFeedbackService
  ) {
    this.scenario.set(this.urlState.getDefaultScenario());
    this.audioMuted.set(this.audio.isMuted());
  }

  ngOnInit(): void {
    const hydrated = this.urlState.deserializeFromHash();
    if (hydrated) {
      this.scenario.set(hydrated);
      this.activePresetName.set('Custom Runway');
    }
    this.audioMuted.set(this.audio.isMuted());
    this.previousProfitable = this.metrics().isProfitable;
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    const target = event.target as HTMLElement;
    const tag = target?.tagName?.toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

    if (event.key === 'm' || event.key === 'M') {
      this.toggleAudio();
    } else if (event.key === 'r' || event.key === 'R') {
      if (!this.showReportModal()) {
        this.onOpenReport();
      }
    } else if (event.key === 'Escape') {
      if (this.showReportModal()) {
        this.onCloseReport();
      }
    }
  }

  onSavingsChange(savings: number): void {
    this.scenario.update(s => ({ ...s, savings }));
    this.activePresetName.set('Custom Runway');
    this.updateUrlHash();
    this.checkProfitabilityTransition();
  }

  onExpenseChange(expenses: ExpenseBreakdown): void {
    this.scenario.update(s => ({ ...s, expenses }));
    this.activePresetName.set('Custom Runway');
    this.updateUrlHash();
    this.checkProfitabilityTransition();
  }

  onIncomeChange(income: IncomeBreakdown): void {
    this.scenario.update(s => ({ ...s, income }));
    this.activePresetName.set('Custom Runway');
    this.updateUrlHash();
    this.checkProfitabilityTransition();
  }

  onSelectPreset(preset: ScenarioPreset): void {
    const clone = JSON.parse(JSON.stringify(preset.scenario));
    this.scenario.set(clone);
    this.activePresetName.set(preset.name);
    this.updateUrlHash();

    const m = this.calculator.calculateMetrics(clone);
    if (m.isProfitable) {
      this.audio.playProfitChime();
      this.triggerConfetti();
    } else {
      this.audio.playTick();
    }
    this.previousProfitable = m.isProfitable;
  }

  onSliderInteract(): void {
    this.audio.playTick();
  }

  toggleAudio(): void {
    const next = this.audio.toggleMute();
    this.audioMuted.set(next);
  }

  onOpenReport(): void {
    this.showReportModal.set(true);
  }

  onCloseReport(): void {
    this.showReportModal.set(false);
  }

  async copyShareUrl(): Promise<void> {
    const url = this.shareUrl();
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        this.copiedFeedback.set(true);
        setTimeout(() => this.copiedFeedback.set(false), 2000);
      }
    } catch {}
  }

  private updateUrlHash(): void {
    if (typeof window !== 'undefined' && window.history && window.history.replaceState) {
      const hash = this.urlState.serializeToHash(this.scenario());
      if (hash) {
        window.history.replaceState(null, '', hash);
      }
    }
  }

  private checkProfitabilityTransition(): void {
    const current = this.metrics().isProfitable;
    if (current && !this.previousProfitable) {
      this.audio.playProfitChime();
      this.triggerConfetti();
    }
    this.previousProfitable = current;
  }

  private triggerConfetti(): void {
    try {
      if (typeof window !== 'undefined') {
        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.6 }
        });
      }
    } catch {}
  }
}

// Re-export App for backward compatibility
export { AppComponent as App };
