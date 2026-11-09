import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AppComponent } from './app';
import { RunwayCalculatorService } from './services/runway-calculator.service';
import { UrlStateService } from './services/url-state.service';
import { AudioFeedbackService } from './services/audio-feedback.service';

describe('AppComponent Integration Orchestration (TDD Specification)', () => {
  let app: AppComponent;
  let calculator: RunwayCalculatorService;
  let urlState: UrlStateService;
  let audio: AudioFeedbackService;

  beforeEach(() => {
    localStorage.clear();
    calculator = new RunwayCalculatorService();
    urlState = new UrlStateService();
    audio = new AudioFeedbackService();
    app = new AppComponent(calculator, urlState, audio);
  });

  describe('Initialization & URL State Hydration (HF-005, RR-001)', () => {
    it('should initialize with default scenario and computed metrics', () => {
      app.ngOnInit();
      expect(app.scenario()).not.toBeNull();
      expect(app.metrics()).not.toBeNull();
      expect(app.scenario().savings).toBe(30000);
      expect(app.shareUrl()).toContain('#c=');
    });

    it('should hydrate scenario from URL hash if valid', () => {
      const customScenario = {
        ...urlState.getDefaultScenario(),
        savings: 88000
      };
      const hash = urlState.serializeToHash(customScenario);
      vi.spyOn(urlState, 'deserializeFromHash').mockReturnValue(customScenario);

      app.ngOnInit();
      expect(app.scenario().savings).toBe(88000);
    });
  });

  describe('Reactive Updates & Profitability Triggers (HF-002, HF-006)', () => {
    it('should update metrics when savings changes', () => {
      app.ngOnInit();
      app.onSavingsChange(50000);

      expect(app.scenario().savings).toBe(50000);
      expect(app.metrics().runwayMonths).toBeGreaterThan(0);
    });

    it('should trigger profit chime when switching to a profitable preset', () => {
      const chimeSpy = vi.spyOn(audio, 'playProfitChime');
      app.ngOnInit();

      // Agency Consultant is profitable
      app.onSelectPreset({
        name: 'Agency Consultant',
        badge: '',
        description: '',
        scenario: {
          savings: 60000,
          expenses: { housing: 2500, living: 1100, tech: 500, healthTax: 900, discretionary: 500 },
          income: { hourlyRate: 135, weeklyBillableHours: 32, monthlyRetainers: 2500, passiveRevenue: 500 },
          targetBufferMonths: 6
        }
      });

      expect(app.metrics().isProfitable).toBe(true);
      expect(chimeSpy).toHaveBeenCalled();
    });

    it('should toggle audio and sync with service', () => {
      app.ngOnInit();
      const initial = app.audioMuted();
      app.toggleAudio();
      expect(app.audioMuted()).toBe(!initial);
      expect(audio.isMuted()).toBe(!initial);
    });
  });

  describe('Report Modal Open / Close', () => {
    it('should open and close report modal', () => {
      app.ngOnInit();
      expect(app.showReportModal()).toBe(false);

      app.onOpenReport();
      expect(app.showReportModal()).toBe(true);

      app.onCloseReport();
      expect(app.showReportModal()).toBe(false);
    });
  });
});
