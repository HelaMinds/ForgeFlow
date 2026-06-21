const test = require('node:test');
const assert = require('node:assert/strict');
const { normalizeReasoningList, isUserAnswerConstraint } = require('../../shared/reasoningUtils');

test('normalizeReasoningList coerces mixed shapes into strings', () => {
  const result = normalizeReasoningList([
    'plain string',
    { text: 'from text field' },
    { description: 'from description' },
    { from: 'A', to: 'B' },
  ]);

  assert.deepEqual(result, ['plain string', 'from text field', 'from description', 'A → B']);
});

test('normalizeReasoningList drops empties and handles non-arrays', () => {
  assert.deepEqual(normalizeReasoningList(['keep', '', '   ']), ['keep']);
  assert.deepEqual(normalizeReasoningList(null), []);
});

test('isUserAnswerConstraint filters meta constraints', () => {
  assert.equal(isUserAnswerConstraint('Budget: under $10k'), true);
  assert.equal(isUserAnswerConstraint('Q: Some clarifier question'), false);
  assert.equal(isUserAnswerConstraint('Idea type: startup'), false);
});
