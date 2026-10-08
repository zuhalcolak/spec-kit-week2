/**
 * app.js - UI Controller & State Synchronization
 * 
 * Complies with Constitution:
 * - Principle I: Clean separation of presentation and business logic
 * - Principle IV: Defensive state handling
 * - Principle V: Full WCAG AA accessibility, keyboard shortcuts, and ARIA attributes
 */

(function () {
  "use strict";

  // Application State
  const state = {
    currentQuote: null,
    favorites: [],
    isDrawerOpen: false
  };

  // DOM Elements Cache
  const elements = {
    quoteCard: document.getElementById("quote-card"),
    quoteText: document.getElementById("quote-text"),
    quoteAuthor: document.getElementById("quote-author"),
    quoteCategory: document.getElementById("quote-category"),
    favoriteBtn: document.getElementById("favorite-btn"),
    newQuoteBtn: document.getElementById("new-quote-btn"),
    copyQuoteBtn: document.getElementById("copy-quote-btn"),
    favCountBadge: document.getElementById("fav-count-badge"),
    drawerCountBadge: document.getElementById("drawer-count-badge"),
    openFavoritesBtn: document.getElementById("open-favorites-btn"),
    closeDrawerBtn: document.getElementById("close-drawer-btn"),
    drawerBackdrop: document.getElementById("drawer-backdrop"),
    favoritesDrawer: document.getElementById("favorites-drawer"),
    favoritesList: document.getElementById("favorites-list"),
    favoritesEmpty: document.getElementById("favorites-empty"),
    toast: document.getElementById("toast")
  };

  let toastTimeout = null;

  /**
   * Displays an accessible toast notification.
   * 
   * @param {string} message - Message text
   */
  function showToast(message) {
    if (!elements.toast) return;
    elements.toast.textContent = message;
    elements.toast.classList.add("show");
    elements.toast.setAttribute("aria-hidden", "false");

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      elements.toast.classList.remove("show");
      elements.toast.setAttribute("aria-hidden", "true");
    }, 2400);
  }

  /**
   * Updates the visual badges representing the number of favorited quotes.
   */
  function updateFavoriteBadges() {
    const count = state.favorites.length;
    if (elements.favCountBadge) {
      elements.favCountBadge.textContent = count;
      elements.favCountBadge.setAttribute("aria-label", `${count} saved favorites`);
    }
    if (elements.drawerCountBadge) {
      elements.drawerCountBadge.textContent = count;
    }
  }

  /**
   * Synchronizes the favorite button on the main quote card with current state.
   */
  function syncFavoriteButton() {
    if (!elements.favoriteBtn || !state.currentQuote) return;

    const isFav = state.favorites.includes(state.currentQuote.id);
    if (isFav) {
      elements.favoriteBtn.classList.add("favorited");
      elements.favoriteBtn.setAttribute("aria-pressed", "true");
      elements.favoriteBtn.setAttribute("aria-label", "Remove quote from favorites");
      elements.favoriteBtn.setAttribute("title", "Remove from favorites (F)");
    } else {
      elements.favoriteBtn.classList.remove("favorited");
      elements.favoriteBtn.setAttribute("aria-pressed", "false");
      elements.favoriteBtn.setAttribute("aria-label", "Add quote to favorites");
      elements.favoriteBtn.setAttribute("title", "Add to favorites (F)");
    }
  }

  /**
   * Renders a given quote into the main presentation card with smooth fade animation.
   * 
   * @param {Object} quote - Quote object to render
   */
  function renderQuote(quote) {
    if (!quote) return;
    state.currentQuote = quote;

    if (elements.quoteText) {
      elements.quoteText.classList.remove("fade-in");
      elements.quoteText.classList.add("fade-out");

      setTimeout(() => {
        elements.quoteText.textContent = quote.text;
        if (elements.quoteAuthor) {
          elements.quoteAuthor.textContent = quote.author;
        }
        if (elements.quoteCategory) {
          elements.quoteCategory.textContent = quote.category;
        }

        elements.quoteText.classList.remove("fade-out");
        elements.quoteText.classList.add("fade-in");
        syncFavoriteButton();
      }, 150);
    } else {
      syncFavoriteButton();
    }
  }

  /**
   * Selects and displays a new random quote, ensuring consecutive novelty.
   */
  function handleNextQuote() {
    const currentId = state.currentQuote ? state.currentQuote.id : null;
    const nextQuote = window.QuotesService.getRandomQuote(currentId);
    renderQuote(nextQuote);
  }

  /**
   * Toggles favorite status for the currently displayed quote.
   */
  function handleToggleFavorite() {
    if (!state.currentQuote) return;

    const { isFavorite, favorites } = window.StorageService.toggleFavorite(state.currentQuote.id);
    state.favorites = favorites;

    syncFavoriteButton();
    updateFavoriteBadges();

    if (state.isDrawerOpen) {
      renderFavoritesDrawer();
    }

    const toastMsg = isFavorite ? "Added to your favorites" : "Removed from favorites";
    showToast(toastMsg);
  }

  /**
   * Copies the current quote text and author to the clipboard.
   */
  async function handleCopyQuote() {
    if (!state.currentQuote) return;
    const shareText = `"${state.currentQuote.text}" — ${state.currentQuote.author}`;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareText);
        showToast("Quote copied to clipboard!");
      } else {
        showToast("Copied quote!");
      }
    } catch (_) {
      showToast("Unable to access clipboard");
    }
  }

  /**
   * Renders the favorites list inside the slide-over drawer.
   */
  function renderFavoritesDrawer() {
    if (!elements.favoritesList || !elements.favoritesEmpty) return;

    elements.favoritesList.innerHTML = "";

    if (state.favorites.length === 0) {
      elements.favoritesEmpty.classList.add("visible");
      return;
    }

    elements.favoritesEmpty.classList.remove("visible");

    state.favorites.forEach((quoteId) => {
      const quote = window.QuotesService.getQuoteById(quoteId);
      if (!quote) return;

      const li = document.createElement("li");
      li.className = "favorite-item";

      const p = document.createElement("p");
      p.className = "fav-item-quote";
      p.textContent = `“${quote.text}”`;

      const footer = document.createElement("div");
      footer.className = "fav-item-footer";

      const author = document.createElement("cite");
      author.className = "fav-item-author";
      author.textContent = `— ${quote.author}`;

      const actions = document.createElement("div");
      actions.className = "fav-item-actions";

      // "Show in Card" button
      const viewBtn = document.createElement("button");
      viewBtn.className = "fav-btn-view";
      viewBtn.textContent = "Show in Card";
      viewBtn.setAttribute("aria-label", `Show quote by ${quote.author} in main card`);
      viewBtn.addEventListener("click", () => {
        renderQuote(quote);
        closeDrawer();
      });

      // "Remove" button
      const removeBtn = document.createElement("button");
      removeBtn.className = "fav-btn-remove";
      removeBtn.setAttribute("aria-label", `Remove quote by ${quote.author} from favorites`);
      removeBtn.title = "Remove from favorites";
      removeBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
      `;
      removeBtn.addEventListener("click", () => {
        const { favorites } = window.StorageService.toggleFavorite(quote.id);
        state.favorites = favorites;
        updateFavoriteBadges();
        syncFavoriteButton();
        renderFavoritesDrawer();
        showToast("Removed from favorites");
      });

      actions.appendChild(viewBtn);
      actions.appendChild(removeBtn);

      footer.appendChild(author);
      footer.appendChild(actions);

      li.appendChild(p);
      li.appendChild(footer);

      elements.favoritesList.appendChild(li);
    });
  }

  /**
   * Opens the favorites slide-over drawer.
   */
  function openDrawer() {
    state.isDrawerOpen = true;
    renderFavoritesDrawer();

    if (elements.favoritesDrawer) {
      elements.favoritesDrawer.classList.add("open");
      elements.favoritesDrawer.setAttribute("aria-hidden", "false");
    }
    if (elements.drawerBackdrop) {
      elements.drawerBackdrop.classList.add("active");
      elements.drawerBackdrop.setAttribute("aria-hidden", "false");
    }

    if (elements.closeDrawerBtn) {
      elements.closeDrawerBtn.focus();
    }
  }

  /**
   * Closes the favorites slide-over drawer.
   */
  function closeDrawer() {
    state.isDrawerOpen = false;

    if (elements.favoritesDrawer) {
      elements.favoritesDrawer.classList.remove("open");
      elements.favoritesDrawer.setAttribute("aria-hidden", "true");
    }
    if (elements.drawerBackdrop) {
      elements.drawerBackdrop.classList.remove("active");
      elements.drawerBackdrop.setAttribute("aria-hidden", "true");
    }

    if (elements.openFavoritesBtn) {
      elements.openFavoritesBtn.focus();
    }
  }

  /**
   * Initializes event listeners and keyboard shortcuts.
   */
  function setupEventListeners() {
    if (elements.newQuoteBtn) {
      elements.newQuoteBtn.addEventListener("click", handleNextQuote);
    }
    if (elements.favoriteBtn) {
      elements.favoriteBtn.addEventListener("click", handleToggleFavorite);
    }
    if (elements.copyQuoteBtn) {
      elements.copyQuoteBtn.addEventListener("click", handleCopyQuote);
    }
    if (elements.openFavoritesBtn) {
      elements.openFavoritesBtn.addEventListener("click", openDrawer);
    }
    if (elements.closeDrawerBtn) {
      elements.closeDrawerBtn.addEventListener("click", closeDrawer);
    }
    if (elements.drawerBackdrop) {
      elements.drawerBackdrop.addEventListener("click", closeDrawer);
    }

    // Keyboard navigation & shortcuts
    document.addEventListener("keydown", (e) => {
      // Escape closes drawer
      if (e.key === "Escape" && state.isDrawerOpen) {
        closeDrawer();
        return;
      }

      // Ignore shortcuts if user is inside an input or button is actively focused
      const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : "";
      if (activeTag === "input" || activeTag === "textarea") return;

      // Space or N key triggers new quote (when drawer is closed)
      if ((e.code === "Space" || e.key === "n" || e.key === "N") && !state.isDrawerOpen && activeTag !== "button") {
        e.preventDefault();
        handleNextQuote();
      }

      // F key toggles favorite
      if ((e.key === "f" || e.key === "F") && !state.isDrawerOpen && activeTag !== "button") {
        e.preventDefault();
        handleToggleFavorite();
      }
    });
  }

  /**
   * Application Entry Point
   */
  function init() {
    // 1. Load saved favorites defensively from storage
    state.favorites = window.StorageService.getFavorites();
    updateFavoriteBadges();

    // 2. Setup all UI event handlers
    setupEventListeners();

    // 3. Load initial random quote
    handleNextQuote();
  }

  // Run on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
