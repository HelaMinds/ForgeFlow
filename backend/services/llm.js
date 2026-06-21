const PROVIDER = (process.env.LLM_PROVIDER || 'openai').toLowerCase();

// --- Reliability config -----------------------------------------------------
const ATTEMPTS_PER_MODEL = Number(process.env.LLM_RETRIES_PER_MODEL || 2);
const BASE_DELAY_MS = 600;
const MAX_DELAY_MS = 6000;
// Haiku generating a full plan/synthesis JSON (up to max_tokens) can take ~60s, so allow headroom.
const CALL_TIMEOUT_MS = Number(process.env.LLM_TIMEOUT_MS || 120000);

const RETRYABLE_STATUS = new Set([408, 409, 429, 500, 502, 503, 504]);
const RETRYABLE_CODES = new Set([
  'ECONNRESET',
  'ECONNREFUSED',
  'ETIMEDOUT',
  'EPIPE',
  'EAI_AGAIN',
  'ENOTFOUND',
  'UND_ERR_SOCKET',
  'UND_ERR_CONNECT_TIMEOUT',
  'ERR_STREAM_PREMATURE_CLOSE',
]);

// Default Google model fallback chain. Each model has its own free-tier quota,
// so when one is rate-limited we transparently fall through to the next.
const DEFAULT_GOOGLE_CHAIN = [
  'gemini-2.5-flash-lite',
  'gemini-flash-lite-latest',
  'gemini-flash-latest',
  'gemini-2.0-flash-lite',
];

class LLMError extends Error {
  constructor(message, { status, retryable } = {}) {
    super(message);
    this.name = 'LLMError';
    this.status = status;
    this.retryable = retryable;
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getStatus(error) {
  const status = error?.status ?? error?.statusCode ?? error?.response?.status;
  if (typeof status === 'number') return status;
  if (Number.isInteger(error?.code)) return error.code;
  return undefined;
}

function isRetryable(error) {
  if (error instanceof LLMError && typeof error.retryable === 'boolean') {
    return error.retryable;
  }
  const status = getStatus(error);
  if (typeof status === 'number' && RETRYABLE_STATUS.has(status)) {
    return true;
  }
  if (error?.code && RETRYABLE_CODES.has(String(error.code))) {
    return true;
  }
  const message = String(error?.message || '');
  if (/\b(429|500|502|503|504)\b/.test(message)) return true;
  if (/too many requests|service unavailable|overloaded|high demand|rate limit|quota|socket hang up|premature close|timeout|temporarily/i.test(message)) {
    return true;
  }
  return false;
}

function isQuotaError(error) {
  const status = getStatus(error);
  if (status === 429) return true;
  return /quota|too many requests|rate limit|resource_exhausted/i.test(String(error?.message || ''));
}

// Server-suggested retry delay (ms) if the API provides one.
function suggestedDelayMs(error) {
  const retryMatch = String(error?.message || '').match(/retryDelay"?:\s*"?(\d+(?:\.\d+)?)s/i);
  if (retryMatch) {
    return Math.min(Math.round(parseFloat(retryMatch[1]) * 1000), MAX_DELAY_MS);
  }
  return null;
}

async function withTimeout(promiseFactory) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => {
      reject(new LLMError(`LLM request timed out after ${CALL_TIMEOUT_MS}ms`, { status: 504, retryable: true }));
    }, CALL_TIMEOUT_MS);
  });
  try {
    return await Promise.race([promiseFactory(), timeout]);
  } finally {
    clearTimeout(timer);
  }
}

// Retry a single operation on transient failures with exponential backoff + jitter.
async function withRetry(label, fn, maxAttempts = ATTEMPTS_PER_MODEL) {
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await withTimeout(fn);
    } catch (error) {
      lastError = error;

      // Don't burn multiple attempts on a hard quota error — let the caller fall
      // through to the next model instead.
      if (!isRetryable(error) || isQuotaError(error) || attempt === maxAttempts) {
        break;
      }

      const backoff = Math.min(BASE_DELAY_MS * 2 ** (attempt - 1), MAX_DELAY_MS);
      const delay = (suggestedDelayMs(error) ?? backoff) + Math.random() * 200;
      console.warn(
        `[llm:${label}] attempt ${attempt}/${maxAttempts} failed (${getStatus(error) || error?.code || 'error'}). Retrying in ${Math.round(delay)}ms…`,
      );
      await sleep(delay);
    }
  }

  throw lastError;
}

function normalizeError(error) {
  const status = typeof getStatus(error) === 'number' ? getStatus(error) : undefined;
  const raw = String(error?.message || '');
  const isBilling = /prepayment credits|billing|depleted|exceeded your current quota/i.test(raw);

  let friendly;
  if (isBilling) {
    friendly =
      'The Google AI API key has no remaining quota/credits. Add billing or use a key with available quota ' +
      '(AI Studio → project → billing), or switch LLM_PROVIDER in backend/.env.';
  } else if (status === 429 || isQuotaError(error)) {
    friendly = 'All AI models are currently rate-limited. Please wait a minute and try again.';
  } else if (status && status >= 500) {
    friendly = 'The AI provider is temporarily unavailable. Please try again in a moment.';
  } else {
    friendly = error?.message || 'The AI request failed.';
  }
  return new LLMError(friendly, { status: status || 502, retryable: isRetryable(error) });
}

// --- Lazy client builders ---------------------------------------------------
function openAIClientOptions(apiKey, baseURL) {
  return {
    apiKey,
    ...(baseURL ? { baseURL } : {}),
    maxRetries: 0,
    // The SDK's legacy node-fetch transport can truncate valid responses on Node 22.
    fetch: globalThis.fetch,
  };
}

function getOpenAIClient() {
  const OpenAI = require('openai');
  return new OpenAI(openAIClientOptions(process.env.OPENAI_API_KEY));
}

function getGoogleClient() {
  const { GoogleGenerativeAI } = require('@google/generative-ai');
  return new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
}

function getAnthropicClient() {
  const Anthropic = require('@anthropic-ai/sdk');
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY, maxRetries: 0 });
}

// Hugging Face's Inference Router is OpenAI-compatible, so we reuse the openai SDK.
function getHuggingFaceClient() {
  const OpenAI = require('openai');
  return new OpenAI(
    openAIClientOptions(
      process.env.HUGGINGFACE_API_KEY,
      process.env.HUGGINGFACE_BASE_URL || 'https://router.huggingface.co/v1',
    ),
  );
}

// --- Provider implementations ----------------------------------------------
async function callOpenAI(model, { systemPrompt, userPrompt }) {
  const client = getOpenAIClient();
  const response = await client.chat.completions.create({
    model,
    temperature: 0.4,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
  });
  const content = response.choices[0]?.message?.content;
  if (!content) throw new LLMError('Empty response from OpenAI');
  return JSON.parse(content);
}

async function callGoogle(model, { systemPrompt, userPrompt }) {
  const client = getGoogleClient();
  const genModel = client.getGenerativeModel({
    model,
    systemInstruction: systemPrompt,
    generationConfig: { temperature: 0.4, responseMimeType: 'application/json' },
  });
  const result = await genModel.generateContent(userPrompt);
  const content = result.response.text();
  if (!content) throw new LLMError('Empty response from Google AI');
  return JSON.parse(content);
}

async function callAnthropic(model, { systemPrompt, userPrompt }) {
  const client = getAnthropicClient();
  const response = await client.messages.create({
    model,
    // Large enough for the Synthesizer's full roadmap JSON; 4096 truncated it mid-array.
    max_tokens: 8192,
    temperature: 0.4,
    system: `${systemPrompt}\n\nYou must respond with valid JSON only. Do not include any text outside the JSON object.`,
    messages: [{ role: 'user', content: userPrompt }],
  });
  const content = response.content[0]?.text;
  if (!content) throw new LLMError('Empty response from Anthropic');
  if (response.stop_reason === 'max_tokens') {
    throw new LLMError('Anthropic response was truncated at max_tokens', { status: 502, retryable: false });
  }
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new LLMError('No JSON object found in Anthropic response');
  return JSON.parse(jsonMatch[0]);
}

async function callHuggingFace(model, { systemPrompt, userPrompt }) {
  const client = getHuggingFaceClient();
  const response = await client.chat.completions.create({
    model,
    temperature: 0.4,
    messages: [
      { role: 'system', content: `${systemPrompt}\n\nRespond with valid JSON only. Do not include any text outside the JSON object.` },
      { role: 'user', content: userPrompt },
    ],
  });
  const content = response.choices[0]?.message?.content;
  if (!content) throw new LLMError('Empty response from Hugging Face');
  // Open-weights models don't reliably honor a JSON response_format, so extract the object.
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new LLMError('No JSON object found in Hugging Face response');
  return JSON.parse(jsonMatch[0]);
}

function googleModelChain() {
  const primary = process.env.GOOGLE_MODEL;
  const fromEnv = (process.env.GOOGLE_FALLBACK_MODELS || '')
    .split(',')
    .map((m) => m.trim())
    .filter(Boolean);
  const chain = [primary, ...fromEnv, ...DEFAULT_GOOGLE_CHAIN].filter(Boolean);
  return [...new Set(chain)];
}

// Try each model in the chain; retry transient errors per model, fall through on quota.
async function runWithFallback(models, prompt, callFn, providerLabel) {
  let lastError;
  for (const model of models) {
    try {
      return await withRetry(`${providerLabel}:${model}`, () => callFn(model, prompt));
    } catch (error) {
      lastError = error;
      if (!isRetryable(error)) {
        // Hard error (e.g. invalid key / bad request) — fallback won't help.
        throw normalizeError(error);
      }
      console.warn(`[llm:${providerLabel}] model "${model}" unavailable (${getStatus(error) || 'error'}); trying next…`);
    }
  }
  throw normalizeError(lastError);
}

async function runStructuredPrompt({ systemPrompt, userPrompt }) {
  const prompt = { systemPrompt, userPrompt };

  if (PROVIDER === 'google') {
    return runWithFallback(googleModelChain(), prompt, callGoogle, 'google');
  }
  if (PROVIDER === 'anthropic') {
    return runWithFallback([process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5'], prompt, callAnthropic, 'anthropic');
  }
  if (PROVIDER === 'huggingface') {
    return runWithFallback(
      [process.env.HUGGINGFACE_MODEL || 'meta-llama/Llama-3.3-70B-Instruct'],
      prompt,
      callHuggingFace,
      'huggingface',
    );
  }
  return runWithFallback([process.env.OPENAI_MODEL || 'gpt-4o'], prompt, callOpenAI, 'openai');
}

module.exports = {
  runStructuredPrompt,
  LLMError,
  _testing: { isRetryable, openAIClientOptions },
};
