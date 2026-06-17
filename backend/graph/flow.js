const { clarifyIdea } = require('../agents/clarifier');
const { createPlan } = require('../agents/planner');
const { stressTestPlan } = require('../agents/stressTest');
const { synthesizePlan } = require('../agents/synthesizer');

async function runForgeFlow(idea) {
  const clarified = await clarifyIdea(idea);
  const plan = await createPlan(clarified);
  const stressTest = await stressTestPlan({ clarified, plan });
  const finalPlan = await synthesizePlan({ clarified, plan, stressTest });

  return {
    idea,
    clarified,
    plan,
    stressTest,
    finalPlan,
  };
}

module.exports = {
  runForgeFlow,
};
