const { clarifyIdea } = require('../agents/clarifier');
const { runPlanPipeline } = require('./langgraphPipeline');
const {
  buildClarifierTrace,
  buildReasoning,
} = require('./pipelineTrace');

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

  const answerConstraints = userAnswers.map(
    (entry) => `${entry.question}: ${entry.answer}`,
  );

  return {
    ...clarified,
    userAnswers,
    constraints: [...(clarified.constraints || []), ...answerConstraints],
    questions: [],
    openQuestions: [],
  };
}

function snapshotClarified(clarified) {
  return {
    summary: clarified.summary,
    goals: [...(clarified.goals || [])],
    constraints: [...(clarified.constraints || [])],
    openQuestions: [...(clarified.openQuestions || [])],
    questions: [...(clarified.questions || [])],
    ideaType: clarified.ideaType || null,
  };
}

async function runClarify({ idea, ideaType }) {
  const clarified = await clarifyIdea(idea, ideaType);
  const pipelineTrace = [buildClarifierTrace(clarified)];

  return {
    idea,
    ideaType: ideaType || null,
    clarified,
    pipelineTrace,
  };
}

async function runPlanFromAnswers({ idea, answers, clarified }) {
  const baseClarified = clarified || (await clarifyIdea(idea));
  const clarifiedSnapshot = snapshotClarified(baseClarified);
  const enrichedClarified = mergeAnswersIntoClarified(baseClarified, answers);

  const clarifierTrace = [buildClarifierTrace(baseClarified)];

  const { plan, stressTest, finalPlan, pipelineTrace } = await runPlanPipeline({
    idea,
    ideaType: enrichedClarified.ideaType || null,
    clarified: enrichedClarified,
  });

  const reasoning = buildReasoning({ clarifiedSnapshot, plan, stressTest });

  return {
    idea,
    ideaType: enrichedClarified.ideaType || null,
    clarified: enrichedClarified,
    reasoning,
    plan,
    stressTest,
    finalPlan,
    pipelineTrace: [...clarifierTrace, ...pipelineTrace],
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
