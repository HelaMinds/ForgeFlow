const { runStructuredPrompt } = require('../services/llm');
const { normalizeRoadmap } = require('../../shared/planUtils');
const { normalizeReasoningList } = require('../../shared/reasoningUtils');

const SYSTEM_PROMPT = `You are the Planner agent in ForgeFlow.
Build a realistic execution plan from clarified context and confirmed user answers.

The input includes goals, constraints, and userAnswers. Treat userAnswers as confirmed facts
provided by the user — do not re-guess or contradict them. Build phases around these real
constraints, not generic assumptions.

Return JSON with keys: overview, phases, assumptions, dependencies.
phases must be a sequential array of 5-8 objects, each with:
- order (1-based integer)
- title (short phase name)
- description (1-2 sentences on what this phase achieves)
- timeframe (human-readable period, e.g. "Weeks 1-4", "Months 2-4")
- durationDays (estimated days for this phase)
- tasks (array of 3-5 specific, actionable to-do items for this phase)
- milestone (one measurable outcome when the phase is complete)

Respect the user's stated budget, timeline, and skills from userAnswers.
assumptions: array of plain strings (not objects).
dependencies: array of plain strings describing cross-phase dependencies (not objects).
Assumptions should only include items not already confirmed in userAnswers or constraints.`;

async function createPlan(clarified) {
  const result = await runStructuredPrompt({
    systemPrompt: SYSTEM_PROMPT,
    userPrompt: JSON.stringify(clarified, null, 2),
  });

  return {
    overview: result.overview || '',
    phases: normalizeRoadmap(result.phases || []),
    assumptions: normalizeReasoningList(result.assumptions),
    dependencies: normalizeReasoningList(result.dependencies),
  };
}

module.exports = {
  createPlan,
};
