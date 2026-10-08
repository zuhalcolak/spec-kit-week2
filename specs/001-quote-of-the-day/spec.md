# Feature Specification: Quote-of-the-Day Page

**Feature Branch**: `001-quote-of-the-day`  
**Created**: 2026-10-08  
**Status**: Approved (Refined Specification - Post Review Gate)  
**Input**: User description: "A quote-of-the-day page: one random quote from a built-in list, a 'New quote' button, and favoriting that persists across reloads."

## Human Review & Refinement Notes
During the human review gate of Draft v1, the following critical ambiguities were identified and refined:
1. **Random Selection Repetition**: In v1, consecutive random selection could re-pick the currently displayed quote, leading to a dead-click perception. Refined to enforce consecutive novelty (selection excludes current quote).
2. **Favorites Discoverability & Persistence**: In v1, reloading picks a random quote, giving the user no direct mechanism to review their accumulated favorites. Refined to introduce a toggleable "Saved Favorites" drawer/list displaying all favorited quotes, with direct navigation and removal capabilities.
3. **Accessibility & Interactive Feedback**: In v1, the favorite toggle state was vague. Refined to define explicit ARIA attributes (`aria-pressed`, dynamic `aria-label`), visual icon toggling (filled vs. outline heart), and accessible keyboard interaction.
4. **Defensive Storage Schema**: Explicitly standardized the storage key (`qotd_favorites_v1`) and data schema (array of unique IDs) with resilient fallback for corrupted storage.

---

## User Scenarios & Testing

### User Story 1 - Display a Random Quote on Page Load (Priority: P1)
As a visitor opening the application, I want to see an inspiring quote and its author immediately on the page so that I can read a thought of the day.

**Why this priority**: Core value of the application; without displaying a quote, the page has no function.  
**Independent Test**: Load `index.html` in a web browser; verify that quote text and author name are rendered inside the quote container.

**Acceptance Scenarios**:
1. **Given** the user navigates to the page, **When** the page loads, **Then** one quote from the built-in quote collection is displayed with its text, author, and category/tag.
2. **Given** the page has loaded, **When** examining the DOM, **Then** the quote text and author are visible with semantic markup (`<blockquote>`, `<cite>`).

---

### User Story 2 - Request a New Quote without Immediate Repetition (Priority: P2)
As a visitor reading the current quote, I want to click a "New quote" button to view another quote from the list without reloading the page, guaranteeing that I don't see the exact same quote twice in a row.

**Why this priority**: Core interactive feature allowing the user to browse different thoughts smoothly.  
**Independent Test**: Click the "New quote" button multiple times; verify that the new quote is never identical to the immediately preceding quote.

**Acceptance Scenarios**:
1. **Given** a quote is currently displayed, **When** the user clicks the "New quote" button, **Then** a different quote from the built-in list is selected and displayed.
2. **Given** the new quote is displayed, **When** inspecting the favorite button, **Then** its active state automatically reflects whether this newly displayed quote is in the user's favorites list.

---

### User Story 3 - Favorite / Unfavorite Current Quote with Persistence (Priority: P3)
As a visitor who likes a quote, I want to mark it as a favorite with clear visual feedback so that my preference persists across page reloads and browser sessions.

**Why this priority**: Key personalization requirement from the user prompt.  
**Independent Test**: Favorite the currently displayed quote, reload the page, browse until that quote reappears, and verify the favorite status remains active.

**Acceptance Scenarios**:
1. **Given** an unfavorited quote is displayed, **When** the user clicks the favorite button, **Then** the button transitions to the active/favorited state (`aria-pressed="true"`), the quote ID is saved in `localStorage`, and the favorites count badge updates.
2. **Given** a favorited quote is displayed, **When** the user clicks the favorite button again, **Then** the button reverts to the inactive state (`aria-pressed="false"`), and the quote ID is removed from `localStorage`.
3. **Given** quotes were favorited, **When** the browser is reloaded, **Then** all previously favorited quote IDs remain persisted in `localStorage`.

---

### User Story 4 - View and Manage Saved Favorites (Priority: P4)
As a visitor who has favorited quotes, I want to open a "Favorites" list to view all my saved quotes, navigate to any specific saved quote, or remove a favorite directly from the list.

**Why this priority**: Solves the discoverability problem where reloading displays a random quote and leaves favorited quotes inaccessible.  
**Independent Test**: Favorite two quotes, open the Favorites panel, verify both quotes appear with text and author, and remove one quote to observe real-time sync with localStorage.

**Acceptance Scenarios**:
1. **Given** the user has favorited one or more quotes, **When** the user clicks "View Favorites", **Then** a panel opens listing all favorited quotes with their text, author, and a remove button.
2. **Given** the user has no favorited quotes, **When** opening the Favorites panel, **Then** an informative empty state message is shown ("No favorites yet. Click the heart icon to save quotes!").
3. **Given** the Favorites panel is open, **When** clicking "Show in Card" on a quote, **Then** that quote is displayed as the active quote on the main card and the panel closes.

---

### Edge Cases
- **Single or Empty Quote Collection**: If the quote list has only 1 item, "New quote" displays that item without looping errors.
- **Unavailable or Disabled localStorage**: If `localStorage` throws a SecurityError (e.g. private browsing mode), the app falls back to an in-memory session store gracefully without throwing unhandled exceptions.
- **Corrupted localStorage Data**: If data stored under `qotd_favorites_v1` is invalid JSON or not an array of strings, the app recovers gracefully by resetting the storage to `[]`.
- **Keyboard Navigation**: Pressing `Escape` closes the Favorites panel, and all buttons are focusable via `Tab` key.

---

## Requirements

### Functional Requirements
- **FR-001**: System MUST maintain a built-in array of at least 10 high-quality, inspiring quotes containing `id`, `text`, `author`, and `category`.
- **FR-002**: System MUST randomly select and render one quote on initial page load.
- **FR-003**: System MUST provide a "New quote" button that displays a different quote from the built-in list (consecutive duplicate prevention).
- **FR-004**: System MUST provide a favorite toggle button on the main quote card with explicit visual state (filled vs outline heart icon) and ARIA attributes (`aria-pressed`, `aria-label`).
- **FR-005**: System MUST persist the list of favorited quote IDs in browser `localStorage` under the key `qotd_favorites_v1`.
- **FR-006**: System MUST update the favorite button state dynamically whenever a new quote is loaded to match its saved status.
- **FR-007**: System MUST provide a "Favorites" button showing a count badge of total saved favorites.
- **FR-008**: System MUST display a slide-over / modal list of all saved quotes with remove controls and quick-navigation buttons.

### Non-Functional Requirements & Constitutional Constraints
- **NFR-001 (Constitution I - Modularity)**: Pure HTML5, CSS3, and ES6+ vanilla JavaScript. Separation of concerns into `index.html`, `style.css`, and modular JavaScript (`app.js`, `quotes.js`, `storage.js`).
- **NFR-002 (Constitution II - Testability)**: Business logic functions (quote picking with duplicate avoidance, storage validation, favorites toggle) MUST be pure or testable independently via Node.js or automated unit tests.
- **NFR-003 (Constitution III - Simplicity)**: No build tools, Webpack, Babel, or third-party JS libraries. Zero bloat.
- **NFR-004 (Constitution IV - Defensive Storage)**: All `localStorage` interactions wrapped in defensive try/catch blocks with JSON schema validation.
- **NFR-005 (Constitution V - Accessibility)**: Semantic HTML5 (`<blockquote>`, `<cite>`, `<button>`), accessible color contrast (WCAG AA), visible focus outlines, and keyboard navigation.
