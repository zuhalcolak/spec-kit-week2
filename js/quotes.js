/**
 * quotes.js - Curated Quote Dataset & Pure Selection Logic
 * 
 * Complies with Constitution Principle I (Modularity) and Principle II (Testability).
 * Decoupled from DOM manipulation for automated verification.
 */

const QUOTES = [
  {
    id: "q-1",
    text: "Simplicity is prerequisite for reliability.",
    author: "Edsger W. Dijkstra",
    category: "Software Engineering"
  },
  {
    id: "q-2",
    text: "Premature optimization is the root of all evil (or at least most of it) in programming.",
    author: "Donald Knuth",
    category: "Computer Science"
  },
  {
    id: "q-3",
    text: "Make it work, make it right, make it fast.",
    author: "Kent Beck",
    category: "Software Craftsmanship"
  },
  {
    id: "q-4",
    text: "Programs must be written for people to read, and only incidentally for machines to execute.",
    author: "Harold Abelson & Gerald Jay Sussman",
    category: "Education & Code Quality"
  },
  {
    id: "q-5",
    text: "The best error message is the one that never shows up.",
    author: "Thomas Fuchs",
    category: "User Experience"
  },
  {
    id: "q-6",
    text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    author: "Martin Fowler",
    category: "Refactoring"
  },
  {
    id: "q-7",
    text: "There are two ways of constructing a software design: One way is to make it so simple that there are obviously no deficiencies, and the other way is to make it so complicated that there are no obvious deficiencies.",
    author: "C.A.R. Hoare",
    category: "System Design"
  },
  {
    id: "q-8",
    text: "Truth can only be found in one place: the code.",
    author: "Robert C. Martin",
    category: "Clean Code"
  },
  {
    id: "q-9",
    text: "First, solve the problem. Then, write the code.",
    author: "John Johnson",
    category: "Problem Solving"
  },
  {
    id: "q-10",
    text: "It's not a bug – it's an undocumented feature.",
    author: "Anonymous",
    category: "Humor & Realities"
  },
  {
    id: "q-11",
    text: "The most important property of a program is whether it accomplishes the intention of its user.",
    author: "C.A.R. Hoare",
    category: "Software Engineering"
  },
  {
    id: "q-12",
    text: "Talk is cheap. Show me the code.",
    author: "Linus Torvalds",
    category: "Open Source"
  }
];

/**
 * Returns a random quote from the collection.
 * If excludeId is specified and more than one quote exists, guarantees
 * that the returned quote is different from excludeId (consecutive novelty).
 * 
 * @param {string} [excludeId] - ID of the quote to exclude from selection
 * @param {Array} [quoteList=QUOTES] - Optional quote pool for testing
 * @returns {Object} Selected quote
 */
function getRandomQuote(excludeId = null, quoteList = QUOTES) {
  if (!quoteList || quoteList.length === 0) {
    return {
      id: "q-fallback",
      text: "No quotes available in database.",
      author: "System",
      category: "System"
    };
  }

  if (quoteList.length === 1 || !excludeId) {
    const randomIndex = Math.floor(Math.random() * quoteList.length);
    return quoteList[randomIndex];
  }

  const candidatePool = quoteList.filter(q => q.id !== excludeId);
  const randomIndex = Math.floor(Math.random() * candidatePool.length);
  return candidatePool[randomIndex];
}

/**
 * Retrieves a quote by its unique ID.
 * 
 * @param {string} id - Quote ID
 * @param {Array} [quoteList=QUOTES] - Quote pool
 * @returns {Object|null} Matching quote or null
 */
function getQuoteById(id, quoteList = QUOTES) {
  if (!id) return null;
  return quoteList.find(q => q.id === id) || null;
}

/**
 * Returns a shallow copy of all quotes.
 * 
 * @returns {Array} List of all quotes
 */
function getAllQuotes() {
  return [...QUOTES];
}

// UMD / CommonJS / Browser compatibility
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    QUOTES,
    getRandomQuote,
    getQuoteById,
    getAllQuotes
  };
} else if (typeof window !== "undefined") {
  window.QuotesService = {
    QUOTES,
    getRandomQuote,
    getQuoteById,
    getAllQuotes
  };
}
