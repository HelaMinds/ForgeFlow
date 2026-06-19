const { clarifyIdea } = require('../agents/clarifier');
const { createPlan } = require('../agents/planner');
const { stressTestPlan } = require('../agents/stressTest');
const { synthesizePlan } = require('../agents/synthesizer');

function mergeAnswersIntoClarified(clarified, answers) {
  const questionById = new Map(
    (clarified.questions || []).map((question) => [question.id, question.text]),
  );

  const userAnswers = Object.entries(answers)
    .map(([key, answer]) => {
      const trimmedAnswer = typeof answer === 'string' ? answer.trim() : '';
      const questionText = questionById.get(key) || key.trim();

      return {
        id: questionById.has(key) ? key : key.trim(),
        question: questionText,
        answer: trimmedAnswer,
      };
    })
    .filter((entry) => entry.question && entry.answer);

  return {
    ...clarified,
    userAnswers,
    questions: [],
    openQuestions: [],
  };
}

async function runClarify({ idea, ideaType }) {
  const clarified = await clarifyIdea(idea, ideaType);

  return {
    idea,
    ideaType: ideaType || null,
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
  const { clarified } = await runClarify({ idea });
  return runPlanFromAnswers({ idea, answers: {}, clarified });
}

module.exports = {
  mergeAnswersIntoClarified,
  runClarify,
  runPlanFromAnswers,
  runForgeFlow,
};
