const { runStructuredPrompt } = require('../services/llm');

const SYSTEM_PROMPT = `You are the Clarifier agent in ForgeFlow.
Turn vague ideas into structured context.
Return JSON with keys: summary, goals, constraints, openQuestions.
Each array field should contain concise strings.`;

async function clarifyIdea(idea) {
  const result = await runStructuredPrompt({
    systemPrompt: SYSTEM_PROMPT,
    userPrompt: `Idea: ${idea}`,
  });

  return {
    originalIdea: idea,
    summary: result.summary || '',
    goals: result.goals || [],
    constraints: result.constraints || [],
    openQuestions: result.openQuestions || [],
  };
}

module.exports = {
  clarifyIdea,
};
