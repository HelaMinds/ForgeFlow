const severityLevels = ['low', 'medium', 'high'];

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isStringArray(value) {
  return Array.isArray(value) && value.every(isNonEmptyString);
}

const { IDEA_TYPE_IDS } = require('./ideaTypes');

function validateIdeaRequest(body) {
  if (!body || !isNonEmptyString(body.idea)) {
    return { valid: false, error: 'idea is required and must be a non-empty string' };
  }

  const ideaType = body.ideaType?.trim();

  if (ideaType && !IDEA_TYPE_IDS.includes(ideaType)) {
    return { valid: false, error: 'ideaType must be startup, class_project, or side_hustle' };
  }

  return {
    valid: true,
    idea: body.idea.trim(),
    ideaType: ideaType || undefined,
  };
}

function normalizeAnswers(answers) {
  if (!answers || typeof answers !== 'object' || Array.isArray(answers)) {
    return null;
  }

  const normalized = {};

  for (const [question, answer] of Object.entries(answers)) {
    if (!isNonEmptyString(question) || !isNonEmptyString(answer)) {
      continue;
    }

    normalized[question.trim()] = answer.trim();
  }

  return normalized;
}

function validatePlanRequest(body) {
  const ideaValidation = validateIdeaRequest(body);

  if (!ideaValidation.valid) {
    return ideaValidation;
  }

  const answers = normalizeAnswers(body.answers);

  if (!answers || Object.keys(answers).length === 0) {
    return { valid: false, error: 'answers is required and must include at least one question-answer pair' };
  }

  const clarified = body.clarified && typeof body.clarified === 'object' ? body.clarified : undefined;

  return {
    valid: true,
    idea: ideaValidation.idea,
    answers,
    clarified,
  };
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
  validatePlanRequest,
  validateFinalPlan,
};
