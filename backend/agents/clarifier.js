const { runStructuredPrompt } = require('../services/llm');
const { getIdeaTypeLabel } = require('../../shared/ideaTypes');

const SYSTEM_PROMPT = `You are the Clarifier agent in ForgeFlow.
Turn vague ideas into structured context before execution planning.

Return JSON with keys: summary, goals, constraints, questions.

- summary: one sentence restating the idea
- goals: array of concise goal strings
- constraints: array of known or inferred constraints
- questions: array of exactly 3-5 objects, each with:
  - id: short snake_case key (e.g. "target_user", "budget", "timeline")
  - text: one specific question the user must answer
  - type: "text" or "choice"
  - options: array of 2-5 short answer choices (required when type is "choice")

Question rules:
- Ask exactly 3-5 questions. Each must be concrete and answerable in 1-2 sentences.
- Do NOT ask vague questions like "Tell me more about your idea" or "What do you want?"
- Target gaps that would change the plan: audience, budget, timeline, skills, location, success metric, scope.
- Use type "choice" for timeline, budget, experience level, or scope when a small fixed set of answers fits.
- Use type "text" when the answer needs specific detail only the user can provide.`;

function normalizeQuestions(result) {
  const rawQuestions = Array.isArray(result.questions) && result.questions.length > 0
    ? result.questions
    : (result.openQuestions || []).map((text) => ({ text }));

  return rawQuestions
    .map((question, index) => {
      const text = typeof question.text === 'string' ? question.text.trim() : '';
      const options = Array.isArray(question.options)
        ? question.options
          .map((option) => (typeof option === 'string' ? option.trim() : ''))
          .filter(Boolean)
        : [];
      const isChoice = question.type === 'choice' && options.length >= 2;

      return {
        id: typeof question.id === 'string' && question.id.trim()
          ? question.id.trim()
          : `q${index + 1}`,
        text,
        type: isChoice ? 'choice' : 'text',
        options: isChoice ? options : undefined,
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
