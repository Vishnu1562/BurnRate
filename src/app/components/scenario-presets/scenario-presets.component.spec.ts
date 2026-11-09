import { describe, it, expect, beforeEach } from 'vitest';
import { ScenarioPresetsComponent, PRESET_SCENARIOS } from './scenario-presets.component';

describe('ScenarioPresetsComponent (TDD Specification)', () => {
  let component: ScenarioPresetsComponent;

  beforeEach(() => {
    component = new ScenarioPresetsComponent();
  });

  describe('HF-003: Preset Selection', () => {
    it('should have 4 predefined presets with badges and descriptions', () => {
      expect(component.presets.length).toBe(4);
      expect(component.presets.some(p => p.name === 'Quit & Freelance')).toBe(true);
      expect(component.presets.some(p => p.name === 'Bootstrap Founder')).toBe(true);
      expect(component.presets.some(p => p.name === 'Agency Consultant')).toBe(true);
      expect(component.presets.some(p => p.name === 'Digital Nomad')).toBe(true);
    });

    it('should emit selectPreset when a preset card is clicked', () => {
      let emittedPreset: any = null;
      component.selectPreset.subscribe((p) => {
        emittedPreset = p;
      });

      component.onChoosePreset(component.presets[0]);
      expect(emittedPreset?.name).toBe('Quit & Freelance');
      expect(emittedPreset?.scenario.savings).toBe(25000);
    });
  });
});
