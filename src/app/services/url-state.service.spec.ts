import { describe, it, expect, beforeEach } from 'vitest';
import { UrlStateService } from './url-state.service';
import { RunwayScenario } from '../models/burn-rate.model';

describe('UrlStateService (TDD Specification)', () => {
  let service: UrlStateService;

  beforeEach(() => {
    service = new UrlStateService();
  });

  const sampleScenario: RunwayScenario = {
    savings: 45000,
    expenses: {
      housing: 2100,
      living: 950,
      tech: 350,
      healthTax: 700,
      discretionary: 600
    },
    income: {
      hourlyRate: 110,
      weeklyBillableHours: 24,
      monthlyRetainers: 1500,
      passiveRevenue: 300
    },
    targetBufferMonths: 9
  };

  describe('HF-004 & HF-005: Bi-directional Serialization', () => {
    it('should serialize scenario into a valid URL hash string', () => {
      const hash = service.serializeToHash(sampleScenario);
      expect(hash).toContain('#c=');
      expect(hash.length).toBeGreaterThan(10);
    });

    it('should deserialize serialized hash back into exact matching scenario', () => {
      const hash = service.serializeToHash(sampleScenario);
      const restored = service.deserializeFromHash(hash);

      expect(restored).not.toBeNull();
      expect(restored?.savings).toBe(45000);
      expect(restored?.expenses.housing).toBe(2100);
      expect(restored?.income.hourlyRate).toBe(110);
      expect(restored?.income.weeklyBillableHours).toBe(24);
      expect(restored?.targetBufferMonths).toBe(9);
    });

    it('should generate complete shareable browser URL', () => {
      const shareUrl = service.generateShareUrl(sampleScenario);
      expect(shareUrl).toContain('#c=');
    });
  });

  describe('NF-002: Malformed Hash Safeguard', () => {
    it('should return null and not crash when hash is corrupted or empty', () => {
      expect(service.deserializeFromHash('')).toBeNull();
      expect(service.deserializeFromHash('#')).toBeNull();
      expect(service.deserializeFromHash('#c=THIS_IS_CORRUPTED_BASE64_GARBAGE!@#')).toBeNull();
      expect(service.deserializeFromHash('#c=e30=')).toBeNull(); // empty object {}
    });
  });

  describe('Default Preset Baseline', () => {
    it('should provide a valid default scenario', () => {
      const def = service.getDefaultScenario();
      expect(def.savings).toBeGreaterThan(0);
      expect(def.expenses.housing).toBeGreaterThan(0);
    });
  });
});
