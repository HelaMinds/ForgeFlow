const { runStructuredPrompt } = require('../services/llm');

const SYSTEM_PROMPT = `You are the Clarifier agent in ForgeFlow.
Turn vague ideas into structured context before execution planning.

Return JSON with keys: summary, goals, constraints, questions.

- summary: one sentence restating the idea
- goals: array of concise goal strings
- constraints: array of known or inferred constraints
- questions: array of exactly 3-5 objects, each with:
  - id: short snake_case key (e.g. "target_user", "budget", "timeline")
  - text: one specific question the user must answer

Question rules:
- Ask exactly 3-5 questions. Each must be concrete and answerable in 1-2 sentences.
- Do NOT ask vague questions like "Tell me more about your idea" or "What do you want?"
- Target gaps that would change the plan: audience, budget, timeline, skills, location, success metric, scope.
- Each question should request a missing fact the Planner cannot safely assume.`;

function normalizeQuestions(result) {
  if (Array.isArray(result.questions) && result.questions.length > 0) {
    return result.questions
      .map((question, index) => ({
        id: typeof question.id === 'string' && question.id.trim()
          ? question.id.trim()
          : `q${index + 1}`,
        text: typeof question.text === 'string' ? question.text.trim() : '',
      }))
      .filter((question) => question.text)
      .slice(0, 5);
  }

  if (Array.isArray(result.openQuestions)) {
    return result.openQuestions
      .map((text, index) => ({
        id: `q${index + 1}`,
        text: typeof text === 'string' ? text.trim() : '',
      }))
      .filter((question) => question.text)
      .slice(0, 5);
  }

  return [];
}

async function clarifyIdea(idea) {
  const result = await runStructuredPrompt({
    systemPrompt: SYSTEM_PROMPT,
    userPrompt: `Idea: ${idea}`,
  });

  const questions = normalizeQuestions(result);

  return {
    originalIdea: idea,
    summary: result.summary || '',
    goals: result.goals || [],
    constraints: result.constraints || [],
    questions,
    openQuestions: questions.map((question) => question.text),
  };
}

module.exports = {
  clarifyIdea,
};
