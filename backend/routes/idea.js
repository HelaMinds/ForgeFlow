const express = require('express');
const { validateIdeaRequest } = require('../../shared/schemas');
const { runForgeFlow } = require('../graph/flow');

const router = express.Router();

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
