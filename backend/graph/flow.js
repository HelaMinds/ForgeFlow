const { clarifyIdea } = require('../agents/clarifier');
const { createPlan } = require('../agents/planner');
const { stressTestPlan } = require('../agents/stressTest');
const { synthesizePlan } = require('../agents/synthesizer');

function mergeAnswersIntoClarified(clarified, answers) {
  const userAnswers = Object.entries(answers)
    .map(([question, answer]) => ({
      question: question.trim(),
      answer: typeof answer === 'string' ? answer.trim() : '',
    }))
    .filter((entry) => entry.question && entry.answer);

  return {
    ...clarified,
    userAnswers,
    openQuestions: [],
  };
}

async function runClarify(idea) {
  const clarified = await clarifyIdea(idea);

  return {
    idea,
    clarified,
  };
}

async function runPlanFromAnswers({ idea, answers, clarified }) {
  const baseClarified = clarified || (await clarifyIdea(idea));
  const enrichedClarified = mergeAnswersIntoClarified(baseClarified, answers);
  const plan = await createPlan(enrichedClarified);
  const stressTest = await stressTestPlan({ clarified: enrichedClarified, plan });
  const finalPlan = await synthesizePlan({
    clarified: enrichedClarified,
    plan,
    stressTest,
  });

  return {
    idea,
    clarified: enrichedClarified,
    plan,
    stressTest,
    finalPlan,
  };
}

async function runForgeFlow(idea) {
  const { clarified } = await runClarify(idea);
  return runPlanFromAnswers({ idea, answers: {}, clarified });
}

module.exports = {
  mergeAnswersIntoClarified,
  runClarify,
  runPlanFromAnswers,
  runForgeFlow,
};
