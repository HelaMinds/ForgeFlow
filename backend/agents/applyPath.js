const { runStructuredPrompt } = require('../services/llm');
const { normalizeFinalPlan } = require('../../shared/planUtils');
const { buildPathAdapterTrace } = require('../graph/pipelineTrace');

const SYSTEM_PROMPT = `You are the ForgeFlow Path Adapter.
The user chose one strategic path for their execution plan. Reshape the plan to match that path.

Return JSON with keys: message, finalPlan.
- message: 1-2 sentences explaining what changed for this path.
- finalPlan: updated fields only — must include:
  - roadmap (full array, 5-8 steps with order, title, description, timeframe, durationDays, tasks, milestone)
  - firstAction (concrete first step aligned with this path)
  - overview (2-3 sentences reflecting this path)
  - timeline ({ totalDuration })
  - selectedPath ({ id, title } matching the user's choice)

Adapt phase order, tasks, and timeline to the path:
- Lean MVP: fewer phases, faster milestones, minimal scope tasks
- Feature-Rich Launch: longer timeline, more build phases, broader feature tasks
- Partnership Focus: partnership/integration phases early, product phases adjusted

Keep the plan realistic. Do not change pathOptions array.`;

async function applyPathChoice({ context, selectedPath }) {
  const userPrompt = JSON.stringify(
    {
      idea: context.idea,
      clarified: context.clarified,
      currentFinalPlan: context.finalPlan,
      selectedPath,
    },
    null,
    2,
  );

  const result = await runStructuredPrompt({
    systemPrompt: SYSTEM_PROMPT,
    userPrompt,
  });

  const merged = normalizeFinalPlan(
    {
      ...context.finalPlan,
      ...(result.finalPlan || {}),
      selectedPath: {
        id: selectedPath.id,
        title: selectedPath.title,
      },
      pathOptions: context.finalPlan.pathOptions,
    },
    context.stressTest,
    context.clarified,
  );

  const message = result.message || `Plan updated for "${selectedPath.title}".`;

  return {
    message,
    finalPlan: merged,
    selectedPath,
    traceEntry: buildPathAdapterTrace(selectedPath, message),
  };
}

module.exports = {
  applyPathChoice,
};
