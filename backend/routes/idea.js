const express = require('express');
const { validateIdeaRequest, validatePlanRequest } = require('../../shared/schemas');
const { runClarify, runPlanFromAnswers } = require('../graph/flow');
const { chatAboutPlan } = require('../agents/planChat');
const { applyPathChoice } = require('../agents/applyPath');

const router = express.Router();

function validateChatRequest(body) {
  if (!body || typeof body.message !== 'string' || !body.message.trim()) {
    return { valid: false, error: 'message is required' };
  }

  if (!body.context || typeof body.context !== 'object') {
    return { valid: false, error: 'context is required' };
  }

  return {
    valid: true,
    message: body.message.trim(),
    context: body.context,
    history: Array.isArray(body.history) ? body.history : [],
  };
}

router.post('/apply-path', async (req, res, next) => {
  try {
    const { context, selectedPath } = req.body;

    if (!context || typeof context !== 'object') {
      return res.status(400).json({ error: 'context is required' });
    }

    if (!selectedPath?.id || !selectedPath?.title) {
      return res.status(400).json({ error: 'selectedPath with id and title is required' });
    }

    const result = await applyPathChoice({ context, selectedPath });
    return res.json(result);
  } catch (error) {
    return next(error);
  }
});

router.post('/chat', async (req, res, next) => {
  try {
    const validation = validateChatRequest(req.body);

    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    const result = await chatAboutPlan({
      message: validation.message,
      context: validation.context,
      history: validation.history,
    });

    return res.json(result);
  } catch (error) {
    return next(error);
  }
});

router.post('/clarify', async (req, res, next) => {
  try {
    const validation = validateIdeaRequest(req.body);

    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    const result = await runClarify({
      idea: validation.idea,
      ideaType: validation.ideaType,
    });
    return res.json(result);
  } catch (error) {
    return next(error);
  }
});

router.post('/plan', async (req, res, next) => {
  try {
    const validation = validatePlanRequest(req.body);

    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    const result = await runPlanFromAnswers({
      idea: validation.idea,
      answers: validation.answers,
      clarified: validation.clarified,
    });
    return res.json(result);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
