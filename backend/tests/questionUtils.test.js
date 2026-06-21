const test = require('node:test');
const assert = require('node:assert/strict');
const { ensureChoiceQuestions, inferDefaultOptions } = require('../../shared/questionUtils');

test('inferDefaultOptions returns budget options for budget questions', () => {
  const options = inferDefaultOptions('budget', 'What is your budget?');
  assert.ok(options.includes('Under $1,000'));
  assert.ok(options.length >= 4);
});

test('inferDefaultOptions falls back to a generic set', () => {
  const options = inferDefaultOptions('mystery', 'Totally unrelated question');
  assert.ok(options.length >= 4);
});

test('ensureChoiceQuestions forces every question to choice type', () => {
  const questions = ensureChoiceQuestions([
    { id: 'budget', text: 'Budget?' },
    { text: 'Pricing strategy?', type: 'text' },
  ]);

  for (const question of questions) {
    assert.equal(question.type, 'choice');
    assert.ok(question.options.length >= 2);
    assert.ok(question.options.length <= 4);
  }
  // Missing id is backfilled.
  assert.equal(questions[1].id, 'q2');
});

test('ensureChoiceQuestions strips "Other"/"None of" filler options', () => {
  const [question] = ensureChoiceQuestions([
    { id: 'q1', text: 'Pick one', options: ['Alpha', 'Beta', 'Other', 'None of the above'] },
  ]);

  assert.ok(!question.options.some((option) => /other|none of/i.test(option)));
});
