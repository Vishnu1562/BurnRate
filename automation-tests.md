# Automation Test Specification: BurnRate

## Feature Overview
- **Feature Name**: BurnRate — Interactive Runway & Freelance Rate Sandbox
- **Vibe/Theme**: Executive wealth terminal meets tactile physics sandbox. Deep obsidian slate, champagne gold, emerald cashflow surplus, and warm amber burn alerts. Real-time bi-directional calculations, SVG balancing scale, procedural audio feedback, and client-side URL scenario sharing.
- **Tech Stack**: Angular 22 (Standalone Components, Signals, TypeScript, SCSS, Web Audio API, Canvas Confetti, Vitest).
- **Target Audience**: Freelancers, agency founders, bootstrapped software developers, and professionals evaluating career transitions.

---

## Component Architecture Contract
The application is decomposed into clean, focused standalone components:
1. `RunwayCalculatorService` (`src/app/services/runway-calculator.service.ts`):
   - Pure reactive mathematical modeling engine utilizing Angular signals.
   - Calculates monthly burn, gross income (hourly rate × weekly hours × 4.333 + retainers + passive), net cashflow, runway in months, insolvency date, and freedom score (0–100).
   - Handles edge cases: infinite runway when profitable, single-day survival, extreme values.

2. `UrlStateService` (`src/app/services/url-state.service.ts`):
   - Serializes scenario state into a shareable URL hash (`#c=...`).
   - Deserializes and validates URL parameters on startup with safe fallback to presets.

3. `AudioFeedbackService` (`src/app/services/audio-feedback.service.ts`):
   - Web Audio API procedural synthesis:
     - Tactile tick on slider adjustments (`playTick()`)
     - Prosperity cash register chime upon achieving profitability (`playProfitChime()`)
     - Warning tone when runway drops into critical zone (< 3 months) (`playAlertTone()`)
   - Mute preference stored in `localStorage`.

4. `RunwayDashboardComponent` (`app-runway-dashboard`):
   - Real-time Runway Header: "X.X MONTHS OF RUNWAY" or "PROFITABLE / FREEDOM ACHIEVED".
   - Interactive SVG Balancing Scale: visual seesaw tilting left (deficit) or right (surplus) based on Cash Inflow vs Cash Outflow.
   - Financial Velocity Score meter (0 to 100).
   - High-level metric cards: Net Monthly Delta, Total Burn, Savings Multiple.

5. `ExpenseControlsComponent` (`app-expense-controls`):
   - Granular expense categories: Housing, Food/Living, SaaS/Cloud, Healthcare/Taxes, Discretionary.
   - Sliders and numeric input steppers with live updates.

6. `IncomeControlsComponent` (`app-income-controls`):
   - Revenue streams: Hourly Rate, Weekly Billable Hours, Monthly Retainers, Passive Income.
   - Automatic calculation of monthly equivalent revenue.

7. `ScenarioPresetsComponent` (`app-scenario-presets`):
   - Quick-load career transitions: "Quit & Freelance", "Bootstrap Founder", "Agency Consultant", "Digital Nomad".

8. `ReportSummaryModal` (`app-report-summary`):
   - Executive printable report card.
   - 1-click shareable link generator with clipboard feedback.

9. `AppComponent` (`app-root`):
   - Master orchestrator connecting signals, syncing URL state, audio triggers, and confetti celebration upon hitting profitability.

---

## Preconditions
1. Modern web browser with JavaScript and Web Audio API enabled.
2. Responsive from mobile screens (360px width) up to 4K ultra-wide monitors.
3. No backend server required; 100% client-side compute and URL state sharing.

---

## Test Data
- Presets:
  - "Quit & Freelance": Savings $25,000, Hourly $90, Hours 20/wk, Burn $3,200.
  - "Bootstrap Founder": Savings $45,000, Hourly $0, Hours 0, Burn $2,400.
  - "Agency Consultant": Savings $60,000, Hourly $135, Hours 32/wk, Burn $5,500.
  - "Digital Nomad": Savings $18,000, Hourly $65, Hours 20/wk, Burn $1,800.

---

## Happy Flows

### `HF-001`: Calculate Financial Runway for Deficit Scenario
- **Preconditions**: Savings = $30,000, Monthly Burn = $4,000, Monthly Net Income = $1,500.
- **Actions**: System recalculates derived signals.
- **Expected Results**:
  - Net monthly deficit = -$2,500.
  - Runway months = 30,000 / 2,500 = 12.0 months.
  - Date of insolvency is calculated as exactly 12 months from today.
  - Balancing scale tilts left towards expenses.
- **Final State**: `isProfitable = false`, `runwayMonths = 12`.

### `HF-002`: Achieve Profitability (Infinite Runway)
- **Preconditions**: Hourly rate adjusted to $120 at 25 hrs/week ($13,000/mo income) vs $4,000 burn.
- **Actions**: Net cash flow transitions from negative to positive.
- **Expected Results**:
  - Cash register / prosperity chime sounds.
  - Confetti fireworks trigger.
  - Runway status displays "PROFITABLE / INFINITE RUNWAY".
  - Balancing scale tilts right towards surplus.
- **Final State**: `isProfitable = true`, `runwayMonths = Infinity`.

### `HF-003`: 1-Click Career Scenario Presets
- **Preconditions**: User is on dashboard.
- **Actions**: User clicks "Digital Nomad" preset chip.
- **Expected Results**:
  - Savings updates to $18,000.
  - Expenses update to low-COL configuration ($1,800 total).
  - Income updates to $65/hr at 20 hrs/week.
  - Dashboard instantly re-renders new runway metrics.
- **Final State**: Preset applied, URL hash reflects new state.

### `HF-004`: Share Scenario via URL Hash
- **Preconditions**: Custom scenario configured.
- **Actions**: User clicks "Share Scenario" / "Copy Link".
- **Expected Results**:
  - Encodes state into URL hash `#data=...`.
  - Copies complete shareable URL to clipboard via `navigator.clipboard`.
  - Displays "Link Copied!" badge.
- **Final State**: URL updated and copied.

### `HF-005`: Restore Scenario from URL on Page Load
- **Preconditions**: Browser navigates to URL containing encoded hash.
- **Actions**: App initializes.
- **Expected Results**:
  - `UrlStateService` decodes hash parameters.
  - All sliders and counters hydrate with saved values.
- **Final State**: State matches encoded URL payload.

### `HF-006`: Tactile Audio Feedback on Slider Adjustment
- **Preconditions**: Audio is unmuted.
- **Actions**: User scrubs any expense or rate slider.
- **Expected Results**:
  - Low-latency procedural click sound plays on step ticks.
  - Audio preference persisted in `localStorage`.
- **Final State**: Tactile audio feedback delivered.

---

## Negative Flows

### `NF-001`: Negative or NaN Numeric Inputs
- **Preconditions**: User inputs negative value or invalid text into numeric input.
- **Actions**: Input is processed.
- **Expected Results**:
  - Value clamped to minimum (0 for expenses/income, 0 for savings).
  - NaN is guarded and replaced with safe zero.
- **Final State**: No NaN on dashboard displays.

### `NF-002`: Corrupted or Malformed URL Hash
- **Preconditions**: User opens URL with broken or corrupted hash (e.g. `#data=MALFORMED_GARBAGE`).
- **Actions**: App loads.
- **Expected Results**:
  - Catches decode error safely without crash.
  - Loads default preset ("Quit & Freelance") seamlessly.
- **Final State**: Default valid scenario loaded.

### `NF-003`: AudioContext Suspended Autoplay Safeguard
- **Preconditions**: Browser blocks audio autoplay before user interaction.
- **Actions**: App mounts.
- **Expected Results**:
  - No uncaught JavaScript exceptions.
  - Resumes smoothly on first user click or slider scrub.
- **Final State**: Audio initialized gracefully.

---

## Edge Cases

### `EC-001`: Zero Savings and Zero Income
- **Preconditions**: Savings = 0, Income = 0, Expenses = $2,000.
- **Actions**: Calculate runway.
- **Expected Results**:
  - Runway = 0.0 months.
  - Warning banner displays: "Immediate Deficit — 0 Days Remaining".
  - No division by zero crashes.
- **Final State**: `runwayMonths = 0`.

### `EC-002`: Extreme Wealth ($10,000,000+ Savings)
- **Preconditions**: User enters high net worth numbers.
- **Actions**: Numbers formatted.
- **Expected Results**:
  - Currency formatting handles millions (`$10.0M`) without clipping or breaking layout.
- **Final State**: Layout intact.

### `EC-003`: Break-Even Exact Match (Net Cashflow = $0.00)
- **Preconditions**: Income exactly equals expenses.
- **Actions**: Calculate metrics.
- **Expected Results**:
  - Net cashflow = $0.
  - Balancing scale balances horizontally in perfect equilibrium.
  - Runway displays "BREAK-EVEN (SAVINGS PRESERVED)".
- **Final State**: Stable equilibrium state.

---

## Validation Rules
- `VR-001`: All monetary values clamped to non-negative floats: `Math.max(0, val)`.
- `VR-002`: Weekly hours clamped to `[0, 168]`.
- `VR-003`: Effective tax rate clamped to `[0.0, 0.6]`.

---

## State Transitions
- `ST-001`: Deficit Mode (`netCashflow < 0`, amber/red alert theme, finite runway countdown).
- `ST-002`: Break-Even Mode (`netCashflow === 0`, gold equilibrium theme).
- `ST-003`: Surplus / Freedom Mode (`netCashflow > 0`, emerald green prosperity theme, infinite runway).

---

## Recovery & Retry
- `RR-001`: "Reset to Defaults" button restores baseline preset.
- `RR-002`: 1-click fallback to presets if URL hash decoding fails.

---

## Priority Matrix
- **P0 (Critical)**: `HF-001`, `HF-002`, `HF-003`, `HF-004`, `HF-005`, `NF-001`, `EC-001`, `EC-003`.
- **P1 (High)**: `HF-006`, `NF-002`, `VR-001`, `VR-002`, `ST-001`, `ST-003`.
- **P2 (Delight)**: SVG animated balancing scale seesaw, procedural click/chime audio, Canvas confetti.
