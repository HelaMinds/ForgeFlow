const test = require('node:test');
const assert = require('node:assert/strict');
const { validatePlanRequest, validateFinalPlan, validateIdeaRequest } = require('../../shared/schemas');

test('validateIdeaRequest rejects empty idea', () => {
  assert.equal(validateIdeaRequest({ idea: '   ' }).valid, false);
});

test('validateIdeaRequest rejects unknown ideaType', () => {
  assert.equal(validateIdeaRequest({ idea: 'Build a thing', ideaType: 'nonsense' }).valid, false);
});

test('validatePlanRequest requires at least one answer', () => {
  const result = validatePlanRequest({ idea: 'Build a SaaS', answers: {} });
  assert.equal(result.valid, false);
});

test('validatePlanRequest accepts a valid request', () => {
  const result = validatePlanRequest({
    idea: 'Build a SaaS',
    answers: { budget: 'Under $10,000' },
  });
  assert.equal(result.valid, true);
  assert.deepEqual(result.answers, { budget: 'Under $10,000' });
});

test('validateFinalPlan passes for a complete plan', () => {
  const plan = {
    summary: 'A clear plan',
    roadmap: [{ title: 'Step 1' }],
    firstAction: 'Talk to 5 customers',
  };
  assert.equal(validateFinalPlan(plan), true);
});

test('validateFinalPlan fails when summary or firstAction missing', () => {
  assert.equal(validateFinalPlan({ roadmap: [], firstAction: 'go' }), false);
  assert.equal(validateFinalPlan({ summary: 'x', roadmap: [], firstAction: '' }), false);
  assert.equal(validateFinalPlan(null), false);
});
