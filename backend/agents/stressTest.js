const { runStructuredPrompt } = require('../services/llm');
const { normalizeReasoningList } = require('../../shared/reasoningUtils');

const SYSTEM_PROMPT = `You are the Stress Tester agent in ForgeFlow.
Challenge the plan adversarially and surface uncertainty.

Treat userAnswers in clarified context as confirmed by the user — do not list them as weak
assumptions. Focus risks on gaps that remain after the user's answers.

Return JSON with keys: risks, weakAssumptions, failureModes.
risks must be an array of objects with title, description, severity (low|medium|high), and mitigation.
weakAssumptions and failureModes must be arrays of plain strings, not objects.`;

async function stressTestPlan({ clarified, plan }) {
  const result = await runStructuredPrompt({
    systemPrompt: SYSTEM_PROMPT,
    userPrompt: JSON.stringify({ clarified, plan }, null, 2),
  });

  return {
    risks: result.risks || [],
    weakAssumptions: normalizeReasoningList(result.weakAssumptions),
    failureModes: normalizeReasoningList(result.failureModes),
  };
}

module.exports = {
  stressTestPlan,
};
