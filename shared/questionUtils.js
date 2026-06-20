function inferDefaultOptions(id, text) {
  const key = `${id} ${text}`.toLowerCase();

  if (key.includes('market') || key.includes('tam') || key.includes('audience size')) {
    return ['Under 10,000 potential customers', '10,000 – 100,000', '100,000 – 1 million', 'Over 1 million', 'Not validated yet'];
  }

  if (key.includes('pricing') || key.includes('subscription') || key.includes('price')) {
    return ['Under $10/month', '$10 – $30/month', '$30 – $99/month', '$99+/month', 'Freemium with paid tiers'];
  }

  if (key.includes('competitor') || key.includes('competition') || key.includes('alternative')) {
    return ['Large incumbents only', 'Mix of incumbents and startups', 'Mostly niche startups', 'No direct competitors', 'Not researched yet'];
  }

  if (key.includes('feature') || key.includes('mvp') || key.includes('launch') || key.includes('scope')) {
    return ['Single core feature', '2–3 essential features', 'Full-featured v1', 'Integrations-first MVP', 'Manual/concierge MVP first'];
  }

  if (key.includes('budget')) {
    return ['Under $1,000', '$1,000 – $10,000', '$10,000 – $50,000', 'Over $50,000', 'Bootstrapped / no budget'];
  }

  if (key.includes('timeline') || key.includes('deadline')) {
    return ['Under 3 months', '3 – 6 months', '6 – 12 months', 'Over 12 months', 'Flexible / no fixed deadline'];
  }

  if (key.includes('skill') || key.includes('experience') || key.includes('team')) {
    return ['Solo, non-technical', 'Solo, technical', 'Small team (2–5)', 'Experienced team', 'Will hire contractors'];
  }

  return ['Strongly agree / Yes', 'Leaning yes', 'Leaning no', 'No / Not applicable', 'Not sure yet'];
}

function ensureChoiceQuestions(questions) {
  return questions.map((question, index) => {
    const id = question.id || `q${index + 1}`;
    const text = question.text || '';
    const options =
      Array.isArray(question.options) && question.options.length >= 2
        ? question.options.filter(Boolean)
        : inferDefaultOptions(id, text);

    return {
      id,
      text,
      type: 'choice',
      options: options.slice(0, 5),
    };
  });
}

module.exports = {
  inferDefaultOptions,
  ensureChoiceQuestions,
};
