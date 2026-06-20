const MAX_TITLE_LENGTH = 72;
const MAX_TITLE_WORDS = 10;

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function wordCount(text) {
  return text.trim().split(/\s+/).length;
}

function isTooLongForTitle(text) {
  if (!isNonEmptyString(text)) {
    return true;
  }

  return text.length > MAX_TITLE_LENGTH || wordCount(text) > MAX_TITLE_WORDS;
}

function cleanTitle(text) {
  return text
    .replace(/^You aim to (establish|build|create|launch|start)\s+(a\s+)?/i, '')
    .replace(/^A plan to\s+/i, '')
    .replace(/^Plan to\s+/i, '')
    .replace(/\.\s*$/, '')
    .trim();
}

function truncateAtWord(text, maxLength) {
  if (text.length <= maxLength) {
    return text;
  }

  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  if (lastSpace > maxLength * 0.5) {
    return `${truncated.slice(0, lastSpace)}…`;
  }

  return `${truncated}…`;
}

export function derivePlanTitle({ finalPlan, clarified, idea }) {
  const candidates = [finalPlan?.title, clarified?.summary, finalPlan?.summary].filter(isNonEmptyString);

  for (const candidate of candidates) {
    const cleaned = cleanTitle(candidate);
    if (!isTooLongForTitle(cleaned)) {
      return cleaned;
    }
  }

  const firstSentence = idea?.split(/(?<=[.!?])\s+/)[0] || '';
  const cleaned = cleanTitle(firstSentence);

  if (cleaned) {
    return truncateAtWord(cleaned, MAX_TITLE_LENGTH);
  }

  return 'Your execution plan';
}

export function derivePlanSubtitle({ finalPlan, clarified, idea }) {
  if (isNonEmptyString(finalPlan?.overview) && !isTooLongForTitle(finalPlan.overview)) {
    return finalPlan.overview;
  }

  if (isNonEmptyString(finalPlan?.overview)) {
    return finalPlan.overview;
  }

  const title = derivePlanTitle({ finalPlan, clarified, idea });

  if (isNonEmptyString(clarified?.summary) && cleanTitle(clarified.summary) !== title) {
    return clarified.summary;
  }

  if (isNonEmptyString(finalPlan?.summary) && finalPlan.summary !== title && isTooLongForTitle(finalPlan.summary)) {
    return finalPlan.summary;
  }

  const sentences = idea?.split(/(?<=[.!?])\s+/).filter(Boolean) || [];
  if (sentences.length > 1) {
    return sentences.slice(1).join(' ');
  }

  return '';
}

export function extractPlanStats({ idea, userAnswers = [], ideaTypeLabel, phaseCount, totalDuration }) {
  const stats = [];
  const seen = new Set();

  function addStat(stat) {
    if (seen.has(stat.label)) {
      return;
    }

    seen.add(stat.label);
    stats.push(stat);
  }

  for (const entry of userAnswers) {
    const id = entry.id.toLowerCase();

    if (id.includes('budget')) {
      addStat({ label: 'Budget', value: entry.answer });
    }

    if (id.includes('timeline') || id.includes('deadline')) {
      addStat({ label: 'Timeline', value: entry.answer });
    }
  }

  if (idea) {
    const budgetMatch = idea.match(
      /budget\s+of\s+(less than|under|around|about)?\s*(\$[\d,]+(?:\.\d+)?|\d[\d,]*k?)/i,
    );
    if (budgetMatch) {
      const qualifier = budgetMatch[1] ? `${budgetMatch[1]} ` : '';
      addStat({ label: 'Budget', value: `${qualifier}${budgetMatch[2]}`.trim() });
    }

    const timelineMatch = idea.match(
      /(?:timeline|timeframe)\s+of\s+(over|about|around|under|less than)?\s*(\d+\+?\s*(?:months?|years?|weeks?))/i,
    );
    if (timelineMatch) {
      const qualifier = timelineMatch[1] ? `${timelineMatch[1]} ` : '';
      addStat({ label: 'Timeline', value: `${qualifier}${timelineMatch[2]}`.trim() });
    }
  }

  if (ideaTypeLabel) {
    addStat({ label: 'Type', value: ideaTypeLabel });
  }

  if (phaseCount > 0) {
    addStat({ label: 'Phases', value: String(phaseCount) });
  }

  if (totalDuration) {
    addStat({ label: 'Duration', value: totalDuration });
  }

  return stats.slice(0, 5);
}
