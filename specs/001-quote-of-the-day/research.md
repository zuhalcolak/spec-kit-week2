# Technical Research & Decisions: Quote-of-the-Day

## Research Topic 1: Client-Side Architecture (Vanilla vs Framework)
- **Context**: The feature requires a single interactive quote page with state persistence.
- **Decision**: Use vanilla HTML5, CSS3, and ES6 modules without bundling or framework dependencies (React, Vue, Vite, etc.).
- **Rationale**:
  - Eliminates build step and deployment complexity; file can be opened directly in any browser.
  - Satisfies Constitutional Principle III (Maintainability & Simplicity - KISS/YAGNI).
  - Maximizes performance: 0ms bundle build time, instantaneous asset parsing.

## Research Topic 2: Duplicate Prevention in Random Selection
- **Context**: Random selection (`Math.random()`) with a small pool has a high probability of consecutive duplicates, creating an unresponsive user experience.
- **Decision**: Implement a pure selection function `getRandomQuote(quotesList, currentId)`:
  - If `quotesList.length <= 1`, return the only quote.
  - Filter the pool by `quotesList.filter(q => q.id !== currentId)` and select uniformly at random from the candidate pool.
- **Rationale**:
  - Deterministically guarantees consecutive novelty.
  - Pure function, easily tested with automated unit tests without DOM dependencies (Constitution Principle II).

## Research Topic 3: Resilient Persistence Strategy
- **Context**: Browsers can block or wipe `localStorage` under various circumstances (incognito mode, full disk quota, disabled cookies, security sandboxes). Also, users or extensions may corrupt stored data.
- **Decision**: Build a defensive storage module `StorageService`:
  - Storage Key: `qotd_favorites_v1`
  - In-memory fallback (`Set<string>`) if `localStorage` throws `SecurityError` or `QuotaExceededError`.
  - Defensive deserialization: If `JSON.parse` fails or data is not an array of strings, log a warning and return empty array `[]`.
- **Rationale**:
  - Satisfies Constitutional Principle IV (Resilient State & Defensive Persistence).
  - Guarantees the application never crashes due to storage failures.

## Research Topic 4: Accessibility & Keyboard Ergonomics
- **Context**: Interactive buttons (favorite toggle, new quote, favorite panel toggle) need full keyboard and screen reader accessibility.
- **Decision**:
  - Use native `<button>` elements with `tabindex="0"`.
  - Maintain `aria-pressed="true|false"` on the favorite button.
  - Provide `aria-live="polite"` region on the quote container so screen readers announce quote updates.
  - Bind `Escape` key to close the favorites drawer.
- **Rationale**:
  - Satisfies Constitutional Principle V (Accessibility & Web Standards).
