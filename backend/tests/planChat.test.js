const test = require('node:test');
const assert = require('node:assert/strict');
const { chatAboutPlan, needsBudgetAmount } = require('../agents/planChat');

test('vague budget requests ask for a value instead of regenerating the plan', async () => {
  const result = await chatAboutPlan({
    message: 'Add a budget constraint',
    context: {},
  });

  assert.match(result.reply, /What budget limit/i);
  assert.deepEqual(result.changed, []);
  assert.deepEqual(result.updates, {});
});

test('budget requests with a concrete amount can proceed to refinement', () => {
  assert.equal(needsBudgetAmount('Set the total budget to $2,000'), false);
  assert.equal(needsBudgetAmount('Keep the budget under 5k'), false);
});
