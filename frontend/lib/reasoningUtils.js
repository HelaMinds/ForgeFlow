export function normalizeReasoningItem(item) {
  if (typeof item === 'string') {
    return item.trim();
  }

  if (!item || typeof item !== 'object') {
    return String(item ?? '').trim();
  }

  if (typeof item.text === 'string') {
    return item.text.trim();
  }

  if (typeof item.description === 'string') {
    return item.description.trim();
  }

  if (typeof item.title === 'string') {
    return item.title.trim();
  }

  if (typeof item.assumption === 'string') {
    return [
      item.assumption.trim(),
      typeof item.why_weak === 'string' && item.why_weak.trim()
        ? `Why it is weak: ${item.why_weak.trim()}`
        : null,
      typeof item.impact === 'string' && item.impact.trim()
        ? `Impact: ${item.impact.trim()}`
        : null,
    ]
      .filter(Boolean)
      .join(' ');
  }

  if (typeof item.failureMode === 'string' || typeof item.failure_mode === 'string') {
    return (item.failureMode || item.failure_mode).trim();
  }

  if (item.from && item.to) {
    return `${item.from} → ${item.to}`;
  }

  if (item.phase && item.dependsOn) {
    return `${item.phase} depends on ${item.dependsOn}`;
  }

  return Object.values(item)
    .filter((value) => typeof value === 'string' && value.trim())
    .map((value) => value.trim())
    .join(' ');
}

export function normalizeReasoningList(items) {
  if (!Array.isArray(items)) {
    return [];
  }

  return items.map(normalizeReasoningItem).filter(Boolean);
}

export function isUserAnswerConstraint(item) {
  const text = normalizeReasoningItem(item);
  return text && !text.startsWith('Q: ') && !text.startsWith('Idea type:');
}
