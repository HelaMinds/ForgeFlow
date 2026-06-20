const { runStructuredPrompt } = require('../services/llm');
const { normalizeFinalPlan } = require('../../shared/planUtils');

const SYSTEM_PROMPT = `You are the ForgeFlow Plan Refiner.
The user has an execution plan and wants to adjust it through conversation.

You can update plan details based on their request: roadmap phases, pathOptions, firstAction,
overview, risks, timeline, or clarified userAnswers.

Rules:
- Only change what the user asks for. Keep everything else intact.
- Stay realistic. This is decision support, not guaranteed advice.
- If the user picks or prefers a strategic path, reflect that in roadmap and firstAction.
- pathOptions must remain type "choice" style objects with id, title, description, tradeoffs.

Return JSON with keys: reply, updates.
- reply: conversational message explaining what you changed (or why you cannot).
- updates: object with only the fields that changed. Allowed keys:
  - finalPlan (partial: title, summary, overview, roadmap, timeline, pathOptions, risks, firstAction, confidenceNote)
  - userAnswers (array of { id, question, answer } to replace or add)

If no plan changes are needed, return updates as an empty object.`;

async function chatAboutPlan({ message, context, history = [] }) {
  const userPrompt = JSON.stringify(
    {
      currentPlan: context,
      conversationHistory: history.slice(-8),
      userMessage: message,
    },
    null,
    2,
  );

  const result = await runStructuredPrompt({
    systemPrompt: SYSTEM_PROMPT,
    userPrompt,
  });

  const updates = result.updates && typeof result.updates === 'object' ? result.updates : {};
  let mergedFinalPlan = context.finalPlan;

  if (updates.finalPlan && typeof updates.finalPlan === 'object') {
    mergedFinalPlan = normalizeFinalPlan(
      { ...context.finalPlan, ...updates.finalPlan },
      context.stressTest,
      context.clarified,
    );
  }

  let mergedClarified = context.clarified;
  if (Array.isArray(updates.userAnswers) && updates.userAnswers.length > 0) {
    const existing = context.clarified?.userAnswers || [];
    const byId = new Map(existing.map((entry) => [entry.id, entry]));
    for (const entry of updates.userAnswers) {
      if (entry?.id && entry?.answer) {
        byId.set(entry.id, {
          id: entry.id,
          question: entry.question || byId.get(entry.id)?.question || entry.id,
          answer: entry.answer,
        });
      }
    }
    mergedClarified = {
      ...context.clarified,
      userAnswers: Array.from(byId.values()),
    };
  }

  return {
    reply: result.reply || 'Done.',
    updates: {
      finalPlan: updates.finalPlan ? mergedFinalPlan : undefined,
      clarified: updates.userAnswers ? mergedClarified : undefined,
    },
  };
}

module.exports = {
  chatAboutPlan,
};
