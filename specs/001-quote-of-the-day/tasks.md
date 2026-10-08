# Tasks: Quote-of-the-Day Page

**Feature**: Quote-of-the-Day Page  
**Spec**: [specs/001-quote-of-the-day/spec.md](file:///Users/zuhalcolak/.gemini/antigravity/scratch/spec-kit-week2/specs/001-quote-of-the-day/spec.md)  
**Plan**: [specs/001-quote-of-the-day/plan.md](file:///Users/zuhalcolak/.gemini/antigravity/scratch/spec-kit-week2/specs/001-quote-of-the-day/plan.md)  
**Status**: Ready for Implementation  

---

## Phase 1: Setup (Project Scaffolding)
**Purpose**: Establish clean directory structure and base asset placeholders.

- [ ] T001 Create project directories `css/`, `js/`, and `tests/`
- [ ] T002 [P] Create initial `index.html` structure with semantic elements (`<main>`, `<article>`, `<header>`, `<footer>`)
- [ ] T003 [P] Create initial `css/style.css` with CSS custom properties (color palette, typography, responsive breakpoints)

---

## Phase 2: Foundational (Data & Persistence Infrastructure)
**Purpose**: Core data models and persistence services that all user stories depend upon.

- [ ] T004 [P] Implement `js/quotes.js` with curated array of 12 quotes containing `id`, `text`, `author`, and `category`
- [ ] T005 [P] Implement defensive `js/storage.js` module supporting `getFavorites()`, `saveFavorites()`, `toggleFavorite()`, and in-memory fallback
- [ ] T006 [P] Create automated unit test suite `tests/test-quotes.js` verifying quote list integrity
- [ ] T007 [P] Create automated unit test suite `tests/test-storage.js` verifying storage serialization, deserialization, and corrupt data recovery

---

## Phase 3: User Story 1 - Display a Random Quote on Page Load (Priority: P1) 🎯 MVP
**Goal**: Display an initial random quote with author and category upon opening the page.  
**Independent Test**: Load `index.html`; verify that a quote appears with text and author attribution in the main card.

- [ ] T008 [US1] Implement `getRandomQuote()` pure function in `js/quotes.js`
- [ ] T009 [US1] Create quote card DOM elements in `index.html` (`blockquote`, `cite`, category tag, `aria-live="polite"`)
- [ ] T010 [US1] Implement initialization logic in `js/app.js` to select and render a random quote on DOMContentLoaded
- [ ] T011 [US1] Style the quote card in `css/style.css` with accessible typography and high-contrast color scheme

---

## Phase 4: User Story 2 - Request a New Quote with Consecutive Novelty (Priority: P2)
**Goal**: Allow user to fetch a new quote on demand, guaranteeing it is not identical to the current quote.  
**Independent Test**: Click "New quote" button multiple times; verify each new quote is different from the previous quote.

- [ ] T012 [US2] Update `getRandomQuote(excludeId)` in `js/quotes.js` to guarantee consecutive novelty
- [ ] T013 [US2] Add unit test in `tests/test-quotes.js` confirming `getRandomQuote(currentId)` never returns `currentId`
- [ ] T014 [US2] Add "New quote" action button in `index.html` with icon and accessible label
- [ ] T015 [US2] Wire "New quote" click event handler in `js/app.js` with smooth transition animation

---

## Phase 5: User Story 3 - Favorite / Unfavorite with Persistence (Priority: P3)
**Goal**: Allow user to mark the active quote as a favorite, synchronizing immediately with localStorage.  
**Independent Test**: Favorite the displayed quote, refresh the browser, navigate to that quote, and verify the favorite status remains active.

- [ ] T016 [US3] Add favorite toggle button inside the quote card in `index.html` with heart SVG icon and ARIA attributes
- [ ] T017 [US3] Wire favorite toggle handler in `js/app.js` communicating with `storage.js`
- [ ] T018 [US3] Synchronize favorite button active visual state (`.favorited` class, `aria-pressed`, filled SVG) whenever quote changes
- [ ] T019 [US3] Add toast / visual feedback indicator in `css/style.css` and `js/app.js` when quote is favorited/unfavorited

---

## Phase 6: User Story 4 - View and Manage Saved Favorites (Priority: P4)
**Goal**: Provide a slide-over panel to view, navigate to, and remove saved favorite quotes.  
**Independent Test**: Favorite two quotes, open Favorites drawer, verify both appear, click "Show" to load one on main card, click "Remove" to delete.

- [ ] T020 [US4] Add Favorites drawer HTML structure in `index.html` with header, list container, empty state, and close button
- [ ] T021 [US4] Add header "Favorites" button with dynamic count badge in `index.html`
- [ ] T022 [US4] Implement drawer open/close state machine in `js/app.js` (including `Escape` key and backdrop click)
- [ ] T023 [US4] Implement render function for favorite quote cards in drawer with "View in Card" and "Remove" actions
- [ ] T024 [US4] Style drawer, animations, badge, and empty state in `css/style.css`

---

## Phase 7: Polish, Verification & Accessibility
**Purpose**: Cross-cutting quality checks, WCAG AA compliance, and automated test execution.

- [ ] T025 [P] Verify full keyboard navigation (Tab order, focus rings, Enter/Space activation, Escape key handling)
- [ ] T026 [P] Execute automated test runner `node tests/test-quotes.js && node tests/test-storage.js` and verify 100% pass rate
- [ ] T027 [P] Perform responsive design verification across mobile (<480px), tablet, and desktop viewports
- [ ] T028 Update `README.md` and `writeup.md` documenting architecture, test instructions, and SDD reflection

---

## Dependencies & Execution Order
1. Phase 1 (Setup) -> Blocks Phase 2
2. Phase 2 (Foundational Data & Persistence) -> Blocks Phase 3-6
3. Phase 3 (US1: Initial Quote) -> MVP
4. Phase 4 (US2: New Quote) -> Depends on US1
5. Phase 5 (US3: Favoriting) -> Depends on US1 & US2
6. Phase 6 (US4: Favorites Drawer) -> Depends on US3
7. Phase 7 (Polish & Verification) -> Runs after all phases
