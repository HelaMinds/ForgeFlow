const { runStructuredPrompt } = require('../services/llm');

const SYSTEM_PROMPT = `You are the Synthesizer agent in ForgeFlow.
Combine clarified context, plan, and stress test results into a final roadmap.
Return JSON with keys: summary, roadmap, risks, firstAction, confidenceNote.
roadmap must be an array of objects with title, description, and timeframe.`;

async function synthesizePlan({ clarified, plan, stressTest }) {
  const result = await runStructuredPrompt({
    systemPrompt: SYSTEM_PROMPT,
    userPrompt: JSON.stringify({ clarified, plan, stressTest }, null, 2),
  });

  return {
    summary: result.summary || '',
    roadmap: result.roadmap || [],
    risks: result.risks || stressTest.risks || [],
    firstAction: result.firstAction || '',
    confidenceNote: result.confidenceNote || '',
  };
}

module.exports = {
  synthesizePlan,
};
