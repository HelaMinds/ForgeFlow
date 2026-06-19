const { runStructuredPrompt } = require('../services/llm');

const SYSTEM_PROMPT = `You are the Planner agent in ForgeFlow.
Build a realistic execution plan from clarified context and confirmed user answers.

The input includes goals, constraints, and userAnswers. Treat userAnswers as confirmed facts
provided by the user — do not re-guess or contradict them. Build phases around these real
constraints, not generic assumptions.

Return JSON with keys: overview, phases, assumptions, dependencies.
phases must be an array of objects with title, description, and timeframe.
assumptions should only include items not already confirmed in userAnswers or constraints.`;

async function createPlan(clarified) {
  const result = await runStructuredPrompt({
    systemPrompt: SYSTEM_PROMPT,
    userPrompt: JSON.stringify(clarified, null, 2),
  });

  return {
    overview: result.overview || '',
    phases: result.phases || [],
    assumptions: result.assumptions || [],
    dependencies: result.dependencies || [],
  };
}

module.exports = {
  createPlan,
};
