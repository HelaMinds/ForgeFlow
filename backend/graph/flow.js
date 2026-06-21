const { clarifyIdea } = require('../agents/clarifier');
const { assessIdea } = require('../agents/assessor');
const { runPlanPipeline } = require('./langgraphPipeline');
const {
  buildAssessorTrace,
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
  // Assessor and Clarifier both only need the raw idea, so run them together.
  const [assessment, clarified] = await Promise.all([
    assessIdea(idea, ideaType),
    clarifyIdea(idea, ideaType),
  ]);
  const pipelineTrace = [buildAssessorTrace(assessment), buildClarifierTrace(clarified)];

  return {
    idea,
    ideaType: ideaType || null,
    assessment,
    clarified,
    pipelineTrace,
  };
}

async function runPlanFromAnswers({ idea, answers, clarified, assessment }) {
  const baseClarified = clarified || (await clarifyIdea(idea));
  const clarifiedSnapshot = snapshotClarified(baseClarified);
  const enrichedClarified = mergeAnswersIntoClarified(baseClarified, answers);

  const initialTrace = [
    assessment ? buildAssessorTrace(assessment) : null,
    buildClarifierTrace(baseClarified),
  ].filter(Boolean);

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
    pipelineTrace: [...initialTrace, ...pipelineTrace],
  };
}

module.exports = {
  mergeAnswersIntoClarified,
  runClarify,
  runPlanFromAnswers,
};
