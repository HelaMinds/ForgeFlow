const { runStructuredPrompt } = require('../services/llm');

const SYSTEM_PROMPT = `You are the Stress Tester agent in ForgeFlow.
Challenge the plan adversarially and surface uncertainty.
Return JSON with keys: risks, weakAssumptions, failureModes.
risks must be an array of objects with title, description, severity (low|medium|high), and mitigation.`;

async function stressTestPlan({ clarified, plan }) {
  const result = await runStructuredPrompt({
    systemPrompt: SYSTEM_PROMPT,
    userPrompt: JSON.stringify({ clarified, plan }, null, 2),
  });

  return {
    risks: result.risks || [],
    weakAssumptions: result.weakAssumptions || [],
    failureModes: result.failureModes || [],
  };
}

module.exports = {
  stressTestPlan,
};
