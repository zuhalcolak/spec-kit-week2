# Quickstart & Verification Guide: Quote-of-the-Day

## Getting Started

Because the application is built entirely on native web standards (HTML5, CSS3, vanilla JavaScript), there are no build steps, bundlers, or packages to compile.

### Running in Browser
1. Open `index.html` directly in any web browser:
   ```bash
   open index.html # macOS
   # or
   xdg-open index.html # Linux
   ```
2. Or serve via any local static HTTP server:
   ```bash
   python3 -m http.server 8000
   # Open http://localhost:8000 in your browser
   ```

### Running Automated Verification Tests
We provide automated unit tests verifying the core quote selection and storage logic in the `tests/` directory:
```bash
node tests/test-quotes.js
node tests/test-storage.js
```

## Manual Verification Checklist
1. **Initial Load**:
   - [ ] Page loads with a quote displayed in the center card.
   - [ ] The author name and category tag are properly formatted.
   - [ ] The favorite button (heart icon) displays its initial un-favorited state (or favorited if previously saved).
2. **New Quote Interaction**:
   - [ ] Clicking "New quote" changes the quote smoothly.
   - [ ] The newly loaded quote is NEVER the same as the previous quote.
   - [ ] The favorite button updates dynamically to reflect the status of the new quote.
3. **Favoriting & Persistence**:
   - [ ] Clicking the favorite heart marks the quote as a favorite (active visual state, filled heart).
   - [ ] The favorites badge counter increments.
   - [ ] Refreshing the browser page preserves the favorite in `localStorage`.
   - [ ] Clicking the favorite button on a favorited quote removes it and decrements the counter.
4. **Favorites Drawer / Management**:
   - [ ] Clicking "Favorites" opens the side panel displaying all saved quotes.
   - [ ] Clicking "Show in Card" on any quote in the drawer displays it on the main card.
   - [ ] Clicking the delete/trash icon on any item removes it from favorites immediately.
   - [ ] Pressing `Escape` or clicking the close button dismisses the drawer.
