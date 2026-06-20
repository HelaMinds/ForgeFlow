const { runStructuredPrompt } = require('../services/llm');
const { normalizeFinalPlan } = require('../../shared/planUtils');

const SYSTEM_PROMPT = `You are the Synthesizer agent in ForgeFlow.
Combine clarified context, confirmed user answers, plan, and stress test results into a final execution roadmap.

Personalize the roadmap and firstAction using userAnswers — reference the user's stated
budget, timeline, skills, and constraints. Do not present the plan as guaranteed to succeed.

Return JSON with keys: title, summary, overview, roadmap, timeline, risks, firstAction, confidenceNote.

title: short project name only — max 8 words (e.g. "SMB Accounting SaaS Platform"). Never paste the user's full idea.
summary: one outcome sentence, max 25 words. Do NOT repeat or paraphrase the entire original idea.
overview: 2-3 sentence executive brief (what, for whom, timeline, key constraint).

roadmap: sequential array of 5-8 steps. Each step must have:
- order (1-based integer, no gaps)
- title (short phase name)
- description (1-2 sentences)
- timeframe (e.g. "Weeks 1-4", "Months 5-8")
- durationDays (estimated days)
- tasks (array of 3-5 concrete, actionable to-do items the user can check off)
- milestone (one measurable deliverable when this step is done)

timeline: object with totalDuration (e.g. "12+ months") summarizing the full plan length.

pathOptions: array of exactly 2-3 strategic paths the user can choose between. Each with:
- id (snake_case, e.g. "lean_mvp")
- title (short name)
- description (1-2 sentences on this approach)
- tradeoffs (honest pros/cons string)

Use plan.phases as the primary source but refine tasks and ordering for clarity.
Merge stressTest risks into the risks array when relevant.`;

async function synthesizePlan({ clarified, plan, stressTest }) {
  const result = await runStructuredPrompt({
    systemPrompt: SYSTEM_PROMPT,
    userPrompt: JSON.stringify({ clarified, plan, stressTest }, null, 2),
  });

  return normalizeFinalPlan(result, stressTest, clarified);
}

module.exports = {
  synthesizePlan,
};
