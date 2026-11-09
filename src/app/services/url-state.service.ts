import { Injectable } from '@angular/core';
import { RunwayScenario } from '../models/burn-rate.model';

interface CompactPayload {
  s: number; // savings
  e: number[]; // expenses: [housing, living, tech, healthTax, discretionary]
  i: number[]; // income: [hourlyRate, weeklyHours, monthlyRetainers, passiveRevenue]
  b: number; // targetBufferMonths
}

export const DEFAULT_SCENARIO: RunwayScenario = {
  savings: 30000,
  expenses: {
    housing: 1800,
    living: 800,
    tech: 250,
    healthTax: 600,
    discretionary: 450
  },
  income: {
    hourlyRate: 85,
    weeklyBillableHours: 20,
    monthlyRetainers: 500,
    passiveRevenue: 0
  },
  targetBufferMonths: 6
};

@Injectable({
  providedIn: 'root'
})
export class UrlStateService {
  getDefaultScenario(): RunwayScenario {
    return JSON.parse(JSON.stringify(DEFAULT_SCENARIO));
  }

  serializeToHash(scenario: RunwayScenario): string {
    const payload: CompactPayload = {
      s: Math.round(scenario.savings),
      e: [
        Math.round(scenario.expenses.housing),
        Math.round(scenario.expenses.living),
        Math.round(scenario.expenses.tech),
        Math.round(scenario.expenses.healthTax),
        Math.round(scenario.expenses.discretionary)
      ],
      i: [
        Math.round(scenario.income.hourlyRate),
        Math.round(scenario.income.weeklyBillableHours),
        Math.round(scenario.income.monthlyRetainers),
        Math.round(scenario.income.passiveRevenue)
      ],
      b: Math.round(scenario.targetBufferMonths)
    };

    try {
      const json = JSON.stringify(payload);
      const encoded = this.toBase64(json);
      return `#c=${encoded}`;
    } catch {
      return '';
    }
  }

  deserializeFromHash(hashString?: string): RunwayScenario | null {
    const raw = hashString !== undefined ? hashString : (typeof window !== 'undefined' ? window.location.hash : '');
    if (!raw || !raw.includes('#c=')) return null;

    const encoded = raw.split('#c=')[1];
    if (!encoded) return null;

    try {
      const json = this.fromBase64(encoded);
      const payload: CompactPayload = JSON.parse(json);

      if (!payload || typeof payload !== 'object') return null;
      if (typeof payload.s !== 'number' || !Array.isArray(payload.e) || !Array.isArray(payload.i)) {
        return null;
      }

      if (payload.e.length < 5 || payload.i.length < 4) {
        return null;
      }

      return {
        savings: Math.max(0, payload.s),
        expenses: {
          housing: Math.max(0, payload.e[0]),
          living: Math.max(0, payload.e[1]),
          tech: Math.max(0, payload.e[2]),
          healthTax: Math.max(0, payload.e[3]),
          discretionary: Math.max(0, payload.e[4])
        },
        income: {
          hourlyRate: Math.max(0, payload.i[0]),
          weeklyBillableHours: Math.max(0, payload.i[1]),
          monthlyRetainers: Math.max(0, payload.i[2]),
          passiveRevenue: Math.max(0, payload.i[3])
        },
        targetBufferMonths: Math.max(1, payload.b || 6)
      };
    } catch {
      return null;
    }
  }

  generateShareUrl(scenario: RunwayScenario): string {
    const hash = this.serializeToHash(scenario);
    if (typeof window !== 'undefined') {
      const origin = window.location.origin;
      const pathname = window.location.pathname;
      return `${origin}${pathname}${hash}`;
    }
    return `https://burnrate.app${hash}`;
  }

  private toBase64(str: string): string {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) => {
      return String.fromCharCode(parseInt(p1, 16));
    }));
  }

  private fromBase64(str: string): string {
    return decodeURIComponent(Array.prototype.map.call(atob(str), (c: string) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  }
}
