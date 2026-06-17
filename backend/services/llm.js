const OpenAI = require('openai');

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-4o';

async function runStructuredPrompt({ systemPrompt, userPrompt }) {
  const response = await client.chat.completions.create({
    model: DEFAULT_MODEL,
    temperature: 0.4,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
  });

  const content = response.choices[0]?.message?.content;

  if (!content) {
    throw new Error('Empty response from LLM');
  }

  return JSON.parse(content);
}

module.exports = {
  runStructuredPrompt,
};
