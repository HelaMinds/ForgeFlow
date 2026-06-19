const express = require('express');
const { validateIdeaRequest, validatePlanRequest } = require('../../shared/schemas');
const { runClarify, runPlanFromAnswers, runForgeFlow } = require('../graph/flow');

const router = express.Router();

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

router.post('/', async (req, res, next) => {
  try {
    const validation = validateIdeaRequest(req.body);

    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    const result = await runForgeFlow(validation.idea);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
