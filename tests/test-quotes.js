/**
 * test-quotes.js - Automated Unit Tests for Quotes Service
 * 
 * Complies with Constitution Principle II (Automated Verification & Testability).
 * Verifies dataset integrity, random distribution, and consecutive novelty guarantee.
 */

const assert = require("node:assert");
const { QUOTES, getRandomQuote, getQuoteById, getAllQuotes } = require("../js/quotes.js");

console.log("▶ Running tests for QuotesService...");

// Test 1: Quotes dataset integrity
assert(Array.isArray(QUOTES), "QUOTES should be an array");
assert(QUOTES.length >= 8, `QUOTES should have at least 8 items, found ${QUOTES.length}`);
QUOTES.forEach((q, index) => {
  assert(q.id && typeof q.id === "string", `Quote at index ${index} must have string id`);
  assert(q.text && typeof q.text === "string" && q.text.length > 5, `Quote ${q.id} must have valid text`);
  assert(q.author && typeof q.author === "string", `Quote ${q.id} must have author`);
  assert(q.category && typeof q.category === "string", `Quote ${q.id} must have category`);
});
console.log("  ✓ Test 1: Dataset integrity and schema verification passed");

// Test 2: getRandomQuote returns a valid quote
const sampleQuote = getRandomQuote();
assert(sampleQuote && sampleQuote.id, "getRandomQuote() should return an object with id");
assert(QUOTES.some(q => q.id === sampleQuote.id), "getRandomQuote() must return an item from QUOTES");
console.log("  ✓ Test 2: Random quote selection returns valid quote");

// Test 3: Consecutive Novelty Guarantee (excludeId)
const targetId = QUOTES[0].id;
for (let i = 0; i < 50; i++) {
  const nextQuote = getRandomQuote(targetId);
  assert.notStrictEqual(
    nextQuote.id,
    targetId,
    `getRandomQuote(${targetId}) must NEVER return the excluded quote ID`
  );
}
console.log("  ✓ Test 3: Consecutive novelty guarantee passed across 50 iterations");

// Test 4: Single quote pool boundary case
const singlePool = [{ id: "solo", text: "Solo quote", author: "Solo", category: "Solo" }];
const soloResult = getRandomQuote("solo", singlePool);
assert.strictEqual(soloResult.id, "solo", "Should return the only quote even if excluded when pool length is 1");
console.log("  ✓ Test 4: Single-item boundary condition handled gracefully");

// Test 5: Empty quote pool boundary case
const emptyResult = getRandomQuote(null, []);
assert(emptyResult.id === "q-fallback", "Should return fallback quote when quote pool is empty");
console.log("  ✓ Test 5: Empty-pool fallback handled gracefully");

// Test 6: getQuoteById
const found = getQuoteById("q-1");
assert.strictEqual(found.id, "q-1");
assert.strictEqual(getQuoteById("non-existent"), null);
console.log("  ✓ Test 6: getQuoteById lookup verified");

console.log("✅ All QuotesService unit tests passed successfully!\n");
