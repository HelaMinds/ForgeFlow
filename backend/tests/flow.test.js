const test = require('node:test');
const assert = require('node:assert/strict');
const { mergeAnswersIntoClarified } = require('../graph/flow');

test('mergeAnswersIntoClarified maps answers to confirmed userAnswers', () => {
  const clarified = {
    summary: 'A SaaS idea',
    goals: ['Launch MVP'],
    constraints: ['Solo founder'],
    questions: [
      { id: 'budget', text: 'What is your budget?' },
      { id: 'timeline', text: 'What is your timeline?' },
    ],
    openQuestions: ['How will you price it?'],
  };

  const merged = mergeAnswersIntoClarified(clarified, {
    budget: 'Under $10,000',
    timeline: 'Over 12 months',
  });

  assert.equal(merged.userAnswers.length, 2);
  assert.deepEqual(
    merged.userAnswers.find((a) => a.id === 'budget'),
    { id: 'budget', question: 'What is your budget?', answer: 'Under $10,000' },
  );
  // Answers become constraints so downstream agents treat them as confirmed.
  assert.ok(merged.constraints.includes('What is your budget?: Under $10,000'));
  // Open questions are cleared once answered (human gate satisfied).
  assert.deepEqual(merged.questions, []);
  assert.deepEqual(merged.openQuestions, []);
});

test('mergeAnswersIntoClarified drops blank answers', () => {
  const clarified = { questions: [{ id: 'q1', text: 'Question one?' }], constraints: [] };
  const merged = mergeAnswersIntoClarified(clarified, { q1: '   ', q2: '' });

  assert.equal(merged.userAnswers.length, 0);
});

test('mergeAnswersIntoClarified falls back to the key when the question is unknown', () => {
  const merged = mergeAnswersIntoClarified({ questions: [], constraints: [] }, {
    'Custom question?': 'Yes',
  });

  assert.equal(merged.userAnswers[0].question, 'Custom question?');
  assert.equal(merged.userAnswers[0].answer, 'Yes');
});
