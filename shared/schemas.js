const severityLevels = ['low', 'medium', 'high'];

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isStringArray(value) {
  return Array.isArray(value) && value.every(isNonEmptyString);
}

function validateIdeaRequest(body) {
  if (!body || !isNonEmptyString(body.idea)) {
    return { valid: false, error: 'idea is required and must be a non-empty string' };
  }

  return { valid: true, idea: body.idea.trim() };
}

function validateFinalPlan(plan) {
  if (!plan || !isNonEmptyString(plan.summary)) {
    return false;
  }

  if (!Array.isArray(plan.roadmap) || !isNonEmptyString(plan.firstAction)) {
    return false;
  }

  return true;
}

module.exports = {
  severityLevels,
  validateIdeaRequest,
  validateFinalPlan,
};
