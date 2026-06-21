const { runStructuredPrompt } = require('../services/llm');
const { normalizeFinalPlan } = require('../../shared/planUtils');
const { buildPlanRefinerTrace } = require('../graph/pipelineTrace');

const FIELD_LABELS = {
  title: 'title',
  summary: 'summary',
  overview: 'overview',
  roadmap: 'timeline',
  timeline: 'timeline',
  pathOptions: 'path options',
  risks: 'risks',
  firstAction: 'first action',
  confidenceNote: 'confidence note',
};

function describeChangedFields(updates) {
  const changed = [];

  if (updates.finalPlan && typeof updates.finalPlan === 'object') {
    for (const key of Object.keys(updates.finalPlan)) {
      const label = FIELD_LABELS[key];
      if (label && !changed.includes(label)) {
        changed.push(label);
      }
    }
  }

  if (Array.isArray(updates.userAnswers) && updates.userAnswers.length > 0) {
    changed.push('your answers');
  }

  return changed;
}

const SYSTEM_PROMPT = `You are the ForgeFlow Plan Refiner.
The user has an execution plan and wants to adjust it through conversation.

You can update plan details based on their request: roadmap phases, pathOptions, firstAction,
overview, risks, timeline, or clarified userAnswers.

Rules:
- Only change what the user asks for. Keep everything else intact.
- Return only the smallest patch needed. Never repeat the full current plan or unchanged fields.
- Keep reply under 60 words.
- For a new constraint such as budget, timeline, or team size, update userAnswers only unless the
  user explicitly asks you to rewrite plan sections around it.
- If a required constraint value is missing, ask one concise follow-up question and return empty updates.
- Stay realistic. This is decision support, not guaranteed advice.
- If the user picks or prefers a strategic path, reflect that in roadmap and firstAction.
- pathOptions must remain type "choice" style objects with id, title, description, tradeoffs.

Return JSON with keys: reply, updates.
- reply: conversational message explaining what you changed (or why you cannot).
- updates: object with only the fields that changed. Allowed keys:
  - finalPlan (partial: title, summary, overview, roadmap, timeline, pathOptions, risks, firstAction, confidenceNote)
  - userAnswers (array of { id, question, answer } to replace or add)

If no plan changes are needed, return updates as an empty object.`;

function needsBudgetAmount(message) {
  if (!/\bbudget\b/i.test(message)) {
    return false;
  }

  return !/(?:[$€£]\s*\d|\b\d[\d,.]*\s*(?:k|thousand|million)?\b|\b(?:under|over|between|maximum|max|limit|cap)\b)/i.test(
    message,
  );
}

async function chatAboutPlan({ message, context, history = [] }) {
  if (needsBudgetAmount(message)) {
    return {
      reply: 'What budget limit should I use? For example: $2,000 total or $500 per month.',
      changed: [],
      traceEntry: null,
      updates: {},
    };
  }

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

  const changed = describeChangedFields(updates);
  const hasChanges = Boolean(updates.finalPlan) || Boolean(updates.userAnswers);

  return {
    reply: result.reply || 'Done.',
    changed,
    traceEntry: hasChanges ? buildPlanRefinerTrace(message, changed) : null,
    updates: {
      finalPlan: updates.finalPlan ? mergedFinalPlan : undefined,
      clarified: updates.userAnswers ? mergedClarified : undefined,
    },
  };
}

module.exports = {
  chatAboutPlan,
  needsBudgetAmount,
};
