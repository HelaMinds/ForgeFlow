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

  if (item.from && item.to) {
    return `${item.from} → ${item.to}`;
  }

  if (item.phase && item.dependsOn) {
    return `${item.phase} depends on ${item.dependsOn}`;
  }

  return JSON.stringify(item);
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
