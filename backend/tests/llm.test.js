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

test('truncated OpenAI JSON becomes a retryable LLM error', () => {
  assert.throws(
    () =>
      _testing.parseStructuredContent('{"reply":"unfinished', {
        provider: 'OpenAI',
        finishReason: 'length',
      }),
    (error) => error.name === 'LLMError' && error.retryable === true && !error.message.includes('Unterminated'),
  );
});

test('malformed provider JSON never exposes the raw parser error', () => {
  assert.throws(
    () => _testing.parseStructuredContent('{"reply":"unfinished', { provider: 'OpenAI' }),
    (error) => error.name === 'LLMError' && error.retryable === true && error.message === 'OpenAI returned incomplete JSON',
  );
});
