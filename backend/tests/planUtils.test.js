const test = require('node:test');
const assert = require('node:assert/strict');
const { normalizeRoadmap, normalizeFinalPlan } = require('../../shared/planUtils');

test('normalizeRoadmap sorts by order and reindexes sequentially', () => {
  const roadmap = normalizeRoadmap([
    { order: 3, title: 'Launch' },
    { order: 1, title: 'Research' },
    { order: 2, title: 'Build' },
  ]);

  assert.deepEqual(
    roadmap.map((step) => step.title),
    ['Research', 'Build', 'Launch'],
  );
  assert.deepEqual(
    roadmap.map((step) => step.order),
    [1, 2, 3],
  );
});

test('normalizeRoadmap fills defaults and filters blank tasks', () => {
  const [step] = normalizeRoadmap([{ title: 'Phase', tasks: ['Do this', '', '  '] }]);

  assert.equal(step.order, 1);
  assert.deepEqual(step.tasks, ['Do this']);
  assert.equal(step.durationDays, null);
});

test('normalizeRoadmap returns [] for non-arrays', () => {
  assert.deepEqual(normalizeRoadmap(undefined), []);
  assert.deepEqual(normalizeRoadmap('nope'), []);
});

test('normalizeFinalPlan produces a stable shape', () => {
  const plan = normalizeFinalPlan(
    {
      title: 'My Plan',
      summary: 'A summary',
      roadmap: [{ title: 'Step 1', durationDays: 400 }],
      pathOptions: [{ id: 'lean', title: 'Lean MVP' }],
      firstAction: 'Start',
    },
    { risks: [{ title: 'Budget risk' }] },
    { summary: 'clarified summary' },
  );

  assert.equal(plan.title, 'My Plan');
  assert.equal(plan.roadmap.length, 1);
  assert.equal(plan.timeline.totalSteps, 1);
  assert.ok(plan.timeline.totalDuration);
  assert.equal(plan.pathOptions.length, 1);
  assert.deepEqual(plan.risks, [{ title: 'Budget risk' }]);
});
