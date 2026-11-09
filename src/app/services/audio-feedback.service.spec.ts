import { describe, it, expect, beforeEach } from 'vitest';
import { AudioFeedbackService } from './audio-feedback.service';

describe('AudioFeedbackService (TDD Specification)', () => {
  let service: AudioFeedbackService;

  beforeEach(() => {
    localStorage.clear();
    service = new AudioFeedbackService();
  });

  describe('HF-006: Mute and Preferences', () => {
    it('should default to unmuted and allow toggling', () => {
      expect(service.isMuted()).toBe(false);

      service.toggleMute();
      expect(service.isMuted()).toBe(true);
      expect(localStorage.getItem('burnrate_muted')).toBe('true');

      service.toggleMute();
      expect(service.isMuted()).toBe(false);
      expect(localStorage.getItem('burnrate_muted')).toBe('false');
    });
  });

  describe('Sound Triggers (HF-002, HF-006, NF-003)', () => {
    it('should play slider tick without throwing', () => {
      expect(() => service.playTick()).not.toThrow();
    });

    it('should play profit chime without throwing', () => {
      expect(() => service.playProfitChime()).not.toThrow();
    });

    it('should play alert tone without throwing', () => {
      expect(() => service.playAlertTone()).not.toThrow();
    });

    it('should safely ignore playback when muted', () => {
      service.setMuted(true);
      expect(() => service.playTick()).not.toThrow();
      expect(() => service.playProfitChime()).not.toThrow();
      expect(() => service.playAlertTone()).not.toThrow();
    });
  });
});
