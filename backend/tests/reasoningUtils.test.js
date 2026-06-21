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

test('normalizeReasoningList formats structured weak assumptions without leaking JSON', () => {
  const result = normalizeReasoningList([
    {
      assumption: '24-hour delivery is achievable.',
      why_weak: 'Clients may delay feedback.',
      impact: 'Deadlines may be missed.',
    },
  ]);

  assert.deepEqual(result, [
    '24-hour delivery is achievable. Why it is weak: Clients may delay feedback. Impact: Deadlines may be missed.',
  ]);
  assert.equal(result[0].includes('{'), false);
});

test('isUserAnswerConstraint filters meta constraints', () => {
  assert.equal(isUserAnswerConstraint('Budget: under $10k'), true);
  assert.equal(isUserAnswerConstraint('Q: Some clarifier question'), false);
  assert.equal(isUserAnswerConstraint('Idea type: startup'), false);
});
