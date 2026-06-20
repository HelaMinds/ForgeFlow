const { runStructuredPrompt } = require('../services/llm');
const { getIdeaTypeLabel } = require('../../shared/ideaTypes');
const { inferDefaultOptions } = require('../../shared/questionUtils');

const SYSTEM_PROMPT = `You are the Clarifier agent in ForgeFlow.
Turn vague ideas into structured context before execution planning.

Return JSON with keys: summary, goals, constraints, questions.

- summary: one sentence restating the idea
- goals: array of concise goal strings
- constraints: array of known or inferred constraints
- questions: array of exactly 3-5 objects, each with:
  - id: short snake_case key (e.g. "target_market_size", "pricing_strategy", "competitors", "mvp_features")
  - text: one specific question the user must answer
  - type: must always be "choice" — never "text"
  - options: array of exactly 4-5 concrete, mutually exclusive answer choices tailored to the idea (required)

Question rules:
- Ask exactly 3-5 questions. Every question MUST be type "choice" with 4-5 selectable options.
- Do NOT use free-text questions. Do NOT ask vague questions like "Tell me more about your idea".
- Target gaps that would change the plan: target market size, pricing, competitors, MVP features, budget, timeline, skills, success metric, scope.
- Each options array must contain realistic, specific choices — not "Option 1/2/3". Example for market size: ["Under 10k businesses", "10k–100k", "100k–1M", "Over 1M"].
- Example for pricing: ["Under $10/month", "$10–$30/month", "$30–$99/month", "Freemium + paid tiers"].
- Example for competitors: list 4-5 real or plausible competitor categories/names relevant to the idea domain.
- Example for MVP features: ["Invoicing only", "Invoicing + expenses", "Full accounting suite", "Integrations-first MVP"].`;

function normalizeQuestions(result) {
  const rawQuestions = Array.isArray(result.questions) && result.questions.length > 0
    ? result.questions
    : (result.openQuestions || []).map((text) => ({ text, type: 'choice' }));

  return rawQuestions
    .map((question, index) => {
      const text = typeof question.text === 'string' ? question.text.trim() : '';
      const id = typeof question.id === 'string' && question.id.trim()
        ? question.id.trim()
        : `q${index + 1}`;

      let options = Array.isArray(question.options)
        ? question.options
          .map((option) => (typeof option === 'string' ? option.trim() : ''))
          .filter(Boolean)
        : [];

      if (options.length < 2) {
        options = inferDefaultOptions(id, text);
      }

      return {
        id,
        text,
        type: 'choice',
        options: options.slice(0, 5),
      };
    })
    .filter((question) => question.text)
    .slice(0, 5);
}

async function clarifyIdea(idea, ideaType) {
  const ideaTypeLabel = ideaType ? getIdeaTypeLabel(ideaType) : null;
  const userPrompt = ideaTypeLabel
    ? `Idea type: ${ideaTypeLabel}\nIdea: ${idea}`
    : `Idea: ${idea}`;

  const result = await runStructuredPrompt({
    systemPrompt: SYSTEM_PROMPT,
    userPrompt,
  });

  const questions = normalizeQuestions(result);
  const baseConstraints = result.constraints || [];
  const constraints = ideaTypeLabel
    ? [`Idea type: ${ideaTypeLabel}`, ...baseConstraints]
    : baseConstraints;

  return {
    originalIdea: idea,
    ideaType: ideaType || null,
    summary: result.summary || '',
    goals: result.goals || [],
    constraints,
    questions,
    openQuestions: questions.map((question) => question.text),
  };
}

module.exports = {
  clarifyIdea,
};
