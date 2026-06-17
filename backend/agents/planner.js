const { runStructuredPrompt } = require('../services/llm');

const SYSTEM_PROMPT = `You are the Planner agent in ForgeFlow.
Build a realistic execution plan from clarified context.
Return JSON with keys: overview, phases, assumptions, dependencies.
phases must be an array of objects with title, description, and timeframe.`;

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
