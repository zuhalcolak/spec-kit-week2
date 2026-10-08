# Daily Lumina — Quote-of-the-Day (Spec-Driven Development)

[![Spec Kit](https://img.shields.io/badge/Spec%20Kit-SDD-blue.svg)](https://github.com/github/spec-kit)
[![Tests](https://img.shields.io/badge/tests-passing-brightgreen.svg)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

An inspirational Quote-of-the-Day web application engineered using **Spec-Driven Development (SDD)** with GitHub's [**Spec Kit**](https://github.com/github/spec-kit).

This repository represents the complete deliverable for **Week 2: Spec-Driven Development with Spec Kit**.

---

## 🌟 Features

- **Random Quote on Load**: Displays an inspiring quote with author attribution and category tagging.
- **Consecutive Novelty**: Clicking the **"New quote"** button guarantees a different quote every time (no consecutive duplicate quotes).
- **Persistent Favoriting**: Mark any quote as a favorite; preferences persist seamlessly across page reloads via `localStorage`.
- **Saved Favorites Drawer**: Open a slide-over drawer to view all accumulated favorites, jump to any saved quote in the main card, or remove quotes.
- **Defensive Architecture**: Zero external dependencies; resilient against localStorage errors, corrupted storage, or private browsing mode restrictions.
- **Full Accessibility (WCAG 2.1 AA)**: Keyboard navigation (`Space`/`N` for new quote, `F` to favorite, `Esc` to close drawer), high contrast, semantic HTML5, and ARIA live announcements.

---

## 📂 Repository & Spec Artifacts Structure

All durable spec artifacts required by the Spec Kit workflow are committed and versioned:

```text
spec-kit-week2/
├── .specify/
│   ├── memory/
│   │   └── constitution.md        # Project Constitution v1.0.0
│   ├── scripts/bash/              # Spec Kit workflow bash scripts
│   └── templates/                 # Spec Kit markdown templates
├── specs/
│   └── 001-quote-of-the-day/
│       ├── spec.md                # Feature Specification (v2 post-review)
│       ├── plan.md                # Implementation Plan
│       ├── research.md            # Technical decisions & trade-offs
│       ├── data-model.md          # Entity schemas & state transitions
│       ├── contracts/             # API & Storage interface contracts
│       ├── quickstart.md          # Verification scenarios
│       └── tasks.md               # Ordered tasks checklist
├── css/
│   └── style.css                  # Modern responsive styling
├── js/
│   ├── quotes.js                  # Quotes dataset & selection service
│   ├── storage.js                 # Defensive localStorage persistence
│   └── app.js                     # UI controller & event handling
├── tests/
│   ├── test-quotes.js             # Automated unit tests for quotes
│   └── test-storage.js            # Automated unit tests for storage
├── index.html                     # Working web application
├── writeup.md                     # Assignment report & SDD reflection
└── README.md                      # Project documentation
```

---

## 🚀 Running the Application

### In Browser
Open `index.html` directly in your browser:
```bash
open index.html
```

Or serve with any static HTTP server:
```bash
python3 -m http.server 8000
# Navigate to http://localhost:8000
```

### Running Automated Verification Tests
Run the test suites directly with Node.js (zero dependencies):
```bash
node tests/test-quotes.js
node tests/test-storage.js
```

---

## 📝 Assignment Deliverables Summary

1. **Spec Artifacts**: Committed under [`.specify/`](file:///.specify/) and [`specs/001-quote-of-the-day/`](file:///specs/001-quote-of-the-day/).
2. **Working Page**: [`index.html`](file:///index.html), [`css/style.css`](file:///css/style.css), [`js/app.js`](file:///js/app.js).
3. **Writeup & Reflection**: See [`writeup.md`](file:///writeup.md) for the detailed prompts log, before/after spec refinement analysis, convergence proof, and learning reflection.
