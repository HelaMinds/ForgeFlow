const test = require('node:test');
const assert = require('node:assert/strict');
const { _testing } = require('../services/llm');

test('OpenAI-compatible clients use the Node native fetch transport', () => {
  const options = _testing.openAIClientOptions('test-key');

  assert.equal(options.fetch, globalThis.fetch);
  assert.equal(options.maxRetries, 0);
});

test('premature response closes are treated as retryable transport errors', () => {
  assert.equal(
    _testing.isRetryable({
      code: 'ERR_STREAM_PREMATURE_CLOSE',
      message: 'Invalid response body: Premature close',
    }),
    true,
  );
});
