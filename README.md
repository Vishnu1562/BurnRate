# 🔥 BurnRate — Executive Financial Runway & Freelance Rate Sandbox

> **A tactile wealth terminal & financial independence simulator built with Angular 22, Angular Signals, procedural Web Audio API, and zero-server URL state persistence.**

[![Angular 22](https://img.shields.io/badge/Angular-22.2-dd0031.svg?style=flat-square&logo=angular)](https://angular.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178c6.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vitest](https://img.shields.io/badge/Vitest-4.1-6e9f18.svg?style=flat-square&logo=vitest)](https://vitest.dev/)
[![Tests](https://img.shields.io/badge/Tests-37%20Passed-10b981.svg?style=flat-square)]()
[![License](https://img.shields.io/badge/License-MIT-amber.svg?style=flat-square)]()

---

## 🌟 Executive Summary

**BurnRate** turns the anxiety of leaving employment into a precise, tactile sandbox. Users simulate startup runway, consulting hourly rates, and survival thresholds with bi-directional reactive sliders, an animated SVG balance seesaw, procedural synth audio feedback, and client-side URL scenario sharing.

Built strictly under **Flow-First Test-Driven Development (TDD)** with **37 automated Vitest tests** covering happy flows, boundary conditions, and state transitions.

---

## 🛠️ Key Architectural & Engineering Highlights

- **Fine-Grained Reactive Graph with Angular Signals**: Zero Zone.js overhead; derived state (`metrics`, `runwayMonths`, `projectedZeroDate`, `freedomScore`, `freedomMultiple`, `shareUrl`) recalculated deterministically on signal mutations.
- **Physical SVG Fulcrum & Balance Scale**: Dynamic SVG seesaw tilting in real-time based on the exact ratio of Net Monthly Cash Inflow vs Monthly Burn Outflow.
- **Procedural Web Audio Engine**: Zero-asset procedural synthesis via Web Audio API oscillators:
  - High-frequency tactile step clicks (`1400Hz -> 300Hz`) on slider interaction.
  - Multi-tone cash register chords (`E6 1318Hz -> G6 1567Hz -> C7 2093Hz`) on achieving profitability.
  - Double warning pulse (`220Hz`) for critical insolvency states.
  - Persistent audio mute preferences saved in `localStorage`.
- **Stateless URL Hash Sharing (`#c=...`)**: Full sandbox state serialized into base64 JSON payload in URL hash for frictionless 1-click sharing, bookmarking, and team collaboration with zero backend dependency.
- **Printable Executive Audit Report Modal**: Clean printable sheet with watermarks, expense breakdowns, runway metrics, and 1-click clipboard link copying (`[R]` shortcut).
- **Keyboard Shortcuts**: First-class accessibility with keyboard shortcuts:
  - `M` — Toggle procedural audio mute/unmute
  - `R` — Open / close executive financial audit modal
  - `Esc` — Dismiss modals immediately

---

## 💼 Resume-Ready Bullet Points

```markdown
- Engineered BurnRate, an executive financial runway sandbox in Angular 22 and TypeScript, modeling burn rates, self-employment tax liabilities, and runway horizons using fine-grained Angular Signals.
- Designed an interactive SVG balance seesaw and procedural Web Audio engine synthesizing real-time auditory cues for tactile slider scrubs and profitability triggers.
- Implemented a zero-backend URL hash state serialization engine (`#c=...`) enabling instantaneous client-side scenario bookmarking and sharing.
- Practiced strict Flow-First TDD, architecting 37 Vitest unit and integration tests across mathematical services, audio decoders, and UI components with 100% green passing rate.
```

---

## 📂 Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── expense-controls/      # Outflow categories & liquid war chest sliders
│   │   ├── income-controls/       # Hourly rates, hours/wk, retainers, passive revenue
│   │   ├── report-summary/        # Printable executive audit sheet & link copier
│   │   ├── runway-dashboard/      # Hero runway readout, SVG seesaw, velocity score
│   │   └── scenario-presets/      # 1-click career archetypes (Solo, Nomad, Agency, Indie)
│   ├── models/
│   │   └── burn-rate.model.ts     # Domain models & type contracts
│   ├── services/
│   │   ├── audio-feedback.service.ts   # Web Audio API sound synthesis
│   │   ├── runway-calculator.service.ts # Core financial mathematics & taxation
│   │   └── url-state.service.ts        # Base64 URL hash serialization
│   ├── app.config.ts              # Angular app configuration
│   ├── app.html                   # Cockpit layout & executive navigation
│   ├── app.scss                   # Obsidian & gold executive theme
│   ├── app.spec.ts                # Master integration tests
│   └── app.ts                     # Root signal orchestrator
├── styles.scss                    # Global CSS variables & typography
└── main.ts                        # Application bootstrap
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js `v20+` or `v24+`
- npm `10+` or `11+`

### Installation
```bash
git clone https://github.com/your-username/burnrate.git
cd burnrate
npm install
```

### Run Locally
```bash
npm start
# Navigate to http://localhost:4200/
```

### Run Tests
```bash
npm test
# Runs 37 Vitest tests with 100% green assertions
```

### Build for Production
```bash
npm run build
# Compiles optimized bundles to dist/burnrate (~65 kB gzipped transfer)
```

---

## 🧪 Test Coverage Summary

| Test Suite | Spec File | Tests Passed |
|:---|:---|:---:|
| **Runway Calculation Engine** | `runway-calculator.service.spec.ts` | 7 / 7 |
| **URL State Hash Encoder/Decoder** | `url-state.service.spec.ts` | 5 / 5 |
| **Web Audio Sound Synthesis** | `audio-feedback.service.spec.ts` | 5 / 5 |
| **Runway Dashboard & SVG Scale** | `runway-dashboard.component.spec.ts` | 4 / 4 |
| **Expense & Capital Controls** | `expense-controls.component.spec.ts` | 3 / 3 |
| **Income & Rate Controls** | `income-controls.component.spec.ts` | 3 / 3 |
| **Scenario Archetype Presets** | `scenario-presets.component.spec.ts` | 2 / 2 |
| **Audit Report Summary Modal** | `report-summary.component.spec.ts` | 2 / 2 |
| **App Master Integration** | `app.spec.ts` | 6 / 6 |
| **Total** | **9 Test Files** | **37 / 37 (100%)** |

---

## 📄 License
MIT © 2026. Built with precision and care.
