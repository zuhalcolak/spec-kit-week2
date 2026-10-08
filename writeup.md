# Week 2 Assignment Writeup: Spec-Driven Development with Spec Kit

**Student Project**: Quote-of-the-Day (`spec-kit-week2`)  
**Repository**: `spec-kit-week2`  
**Methodology**: Spec-Driven Development (SDD) via GitHub Spec Kit  
**Agent Used**: Antigravity (Google DeepMind)  
**Date**: October 8, 2026  

---

## 1. Skill Invocations & Prompts Log

Throughout the assignment, the Spec Kit loop was executed in full accordance with the required workflow:

1. **`/speckit-constitution`**
   - **Prompt**: `Create principles focused on code quality, testing, and maintainability.`
   - **Artifact Generated**: [`.specify/memory/constitution.md`](file:///.specify/memory/constitution.md)
   - **Result**: Established 5 core non-negotiable principles:
     - Principle I: Code Quality & Modularity (separation of concerns, semantic standards)
     - Principle II: Automated Verification & Testability (pure decoupled logic, automated testing without DOM dependencies)
     - Principle III: Maintainability & Simplicity (KISS & YAGNI, zero external bloat)
     - Principle IV: Resilient State & Defensive Persistence (try/catch storage wrapping, schema validation, in-memory fallback)
     - Principle V: Accessibility & Web Standards (WCAG 2.1 AA, keyboard focus, ARIA attributes)

2. **`/speckit-specify`**
   - **Prompt**: `A quote-of-the-day page: one random quote from a built-in list, a "New quote" button, and favoriting that persists across reloads.`
   - **Artifact Generated**: [`specs/001-quote-of-the-day/spec.md`](file:///specs/001-quote-of-the-day/spec.md)
   - **Result**: Scaffolded feature specification `001-quote-of-the-day` defining user stories, acceptance criteria, and functional requirements.

3. **Human Review Gate & Spec Refinement** *(Evaluation Rubric: 20 pts)*
   - **Action**: Performed human review between specification and planning stages. Detected critical ambiguities regarding random quote repetition, favorites accessibility, and lack of a favorites management view.
   - **Artifact Refined**: [`specs/001-quote-of-the-day/spec.md`](file:///specs/001-quote-of-the-day/spec.md) (Draft v1 → Approved v2).

4. **`/speckit-plan`**
   - **Prompt**: `Use plain HTML/CSS/JavaScript, no backend; persist favorites in localStorage.`
   - **Artifacts Generated**:
     - [`specs/001-quote-of-the-day/plan.md`](file:///specs/001-quote-of-the-day/plan.md) (Architecture, constitution check, project structure)
     - [`specs/001-quote-of-the-day/research.md`](file:///specs/001-quote-of-the-day/research.md) (Technical evaluations: vanilla vs framework, defensive storage, novelty algorithms)
     - [`specs/001-quote-of-the-day/data-model.md`](file:///specs/001-quote-of-the-day/data-model.md) (Quote entity and storage state schemas)
     - [`specs/001-quote-of-the-day/contracts/storage-contract.md`](file:///specs/001-quote-of-the-day/contracts/storage-contract.md) (Interface contracts for quotes and storage)
     - [`specs/001-quote-of-the-day/quickstart.md`](file:///specs/001-quote-of-the-day/quickstart.md) (Verification instructions and manual test matrix)

5. **`/speckit-tasks`**
   - **Prompt**: `/speckit-tasks`
   - **Artifact Generated**: [`specs/001-quote-of-the-day/tasks.md`](file:///specs/001-quote-of-the-day/tasks.md)
   - **Result**: Generated a 28-task, 7-phase dependency-ordered execution plan mapping each task to specific user stories (US1–US4) and constitutional requirements.

6. **`/speckit-implement`**
   - **Prompt**: `/speckit-implement`
   - **Implementation Produced**:
     - [`index.html`](file:///index.html): Semantic, accessible layout with quote card, ARIA live region, and favorites drawer.
     - [`css/style.css`](file:///css/style.css): Modern editorial styling, responsive layouts, active heart states, and focus rings.
     - [`js/quotes.js`](file:///js/quotes.js): 12 curated quotes and `getRandomQuote(excludeId)` with consecutive novelty guarantee.
     - [`js/storage.js`](file:///js/storage.js): Defensive localStorage wrapper with sanitization and in-memory fallback.
     - [`js/app.js`](file:///js/app.js): State management, event handling, animations, and keyboard navigation.
     - [`tests/test-quotes.js`](file:///tests/test-quotes.js): Unit test suite for quotes dataset and selection logic (100% pass).
     - [`tests/test-storage.js`](file:///tests/test-storage.js): Unit test suite for storage serialization and corrupt data recovery (100% pass).

7. **`/speckit-converge`**
   - **Prompt**: `/speckit-converge`
   - **Outcome**: **Converged**. 0 remaining gaps found.

---

## 2. Before / After: Spec & Plan Refinement That Changed the Output

As required by the assignment guidelines (*"At least once, when an artifact is vague or wrong, refine the spec/plan (not the code) and note what changed"*), a structured human review was conducted following the initial draft of `spec.md`.

### The Ambiguities Identified in Draft v1
In the initial specification (`spec.md` v1, Git commit `dc3f80a`):
1. **Consecutive Duplicate Quote Glitch**: The user story stated: *"Clicking 'New quote' displays another quote from the list."* In a small built-in list, naive random selection (`Math.random() * list.length`) has an inherent probability of picking the exact same quote currently displayed. To the end user, this manifests as an unresponsive or broken button click.
2. **Favorites Inaccessibility on Reload**: The prompt stated: *"favoriting that persists across reloads."* However, on reload, the application randomly picks a quote. If that quote is not one of the favorited quotes, the user has no direct interface to see what quotes they actually favorited or how many they saved.
3. **Vague Button State & Accessibility**: The initial spec only said *"button indicates the quote is favorited"*, with no definition of ARIA attributes, keyboard accessibility, or visual distinction.

### The Refinement (Draft v1 → Approved v2)
In Git commit `19b0958`, the specification was refined to:
- **Enforce Consecutive Novelty**: Updated FR-003 and User Story 2 to require that `getRandomQuote(currentId)` excludes the active quote from the selection pool, mathematically guaranteeing consecutive novelty.
- **Add User Story 4 (Saved Favorites Management)**: Added FR-007 and FR-008 requiring a dedicated "Favorites" drawer/list showing all saved quotes, a dynamic counter badge, individual quote removal, and a "Show in Card" navigation button.
- **Strict Accessibility Specification**: Defined explicit requirements for `aria-pressed="true|false"`, dynamic `aria-label`, visible focus indicators, and `Escape` key drawer dismissal.
- **Defensive Storage Schema**: Standardized storage key `qotd_favorites_v1` and required corrupted JSON fallback handling to prevent unhandled runtime errors.

### Concrete Impact: How Refining the Spec Changed the Output
Refining the spec **before** implementation fundamentally altered both the generated `tasks.md` and the final codebase:
1. **New Tasks in `tasks.md`**: Tasks T012, T013, T020, T021, T022, T023, and T024 were introduced directly from the refined User Story 4 and consecutive novelty requirements. Without this refinement, none of the drawer or badge tasks would have been planned.
2. **Code Change in `js/quotes.js`**: `getRandomQuote(excludeId)` was implemented with pool filtering rather than raw random indexing, accompanied by a dedicated automated test in `tests/test-quotes.js` proving consecutive novelty across 50 iterations.
3. **Code Change in `index.html` & `js/app.js`**: Added `<aside id="favorites-drawer">`, dynamic badge counters, and drawer event listeners. The user can now actually browse and manage their accumulated favorites collection across page reloads.

---

## 3. Convergence Outcome

The convergence evaluation inspected the implemented codebase against all artifacts (`spec.md`, `plan.md`, `tasks.md`, and `constitution.md`).

### Convergence Verification Matrix

| Area | Requirement / Decision | Verification Evidence | Status |
|:---|:---|:---|:---:|
| **Quotes Dataset** | FR-001 (≥10 curated quotes with id, text, author, category) | 12 quotes defined in `js/quotes.js`, verified by `test-quotes.js` | PASS |
| **Initial Display** | FR-002, US1 (Random quote rendered on page load) | `init()` in `js/app.js` renders random quote on `DOMContentLoaded` | PASS |
| **Consecutive Novelty** | FR-003, US2 (New quote button never repeats active quote) | `getRandomQuote(excludeId)` in `js/quotes.js`, tested 50 iterations in `test-quotes.js` | PASS |
| **Favorite Toggle** | FR-004, US3 (Active/inactive heart, ARIA attributes) | `syncFavoriteButton()` in `js/app.js` sets `aria-pressed`, `.favorited` class, and filled SVG | PASS |
| **Persistence** | FR-005, US3 (Persists across reloads in `localStorage`) | `js/storage.js` stores under `qotd_favorites_v1`, tested in `test-storage.js` | PASS |
| **Favorites Management** | FR-007, FR-008, US4 (Drawer list, counter badge, remove/view) | `#favorites-drawer`, `#fav-count-badge`, and `#favorites-list` in `index.html` & `app.js` | PASS |
| **Constitution I** | Clean separation of concerns, semantic HTML | HTML, CSS, and JS modules cleanly isolated without inline handlers | PASS |
| **Constitution II** | Automated verification without DOM dependencies | `tests/test-quotes.js` and `tests/test-storage.js` pass with 0 failures | PASS |
| **Constitution III** | Simplicity, zero external bloat | Pure vanilla HTML5/CSS3/ES6+, 0 dependencies | PASS |
| **Constitution IV** | Defensive persistence & schema validation | `sanitizeFavoritesData()` and `try/catch` recovery in `js/storage.js` | PASS |
| **Constitution V** | WCAG 2.1 AA accessibility & keyboard support | Tab focus, `Space`/`N`/`F`/`Escape` shortcuts, high-contrast palette | PASS |

**Final Status**: **✅ Converged — the implementation satisfies the spec, plan, tasks, and constitution with 0 remaining gaps.**

---

## 4. What You Learned: Reflection on Spec-Driven Development

Spec-Driven Development (SDD) felt like noticeable overhead during the early phases when writing the constitution, research notes, data models, and interface contracts for what initially appeared to be a simple quote widget. Drafting and versioning markdown artifacts before writing a single line of JavaScript initially felt slower than jumping straight into code. 

However, SDD paid off tremendously at the human review gate: identifying the consecutive quote repetition flaw and the lack of a favorites management view in `spec.md` allowed us to fix the architectural requirements upfront, rather than writing code, noticing the user experience gap later, and having to perform messy refactoring. Once the refined spec and tasks were finalized, the coding agent implemented the entire multi-file application, persistence layer, accessibility features, and automated test suite with zero hallucinations, zero architectural drift, and 100% convergence on the first pass.
