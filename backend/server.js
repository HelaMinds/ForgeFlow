require('dotenv').config();

const express = require('express');
const cors = require('cors');
const ideaRoutes = require('./routes/idea');

// Safety nets: never let an async error take down the whole process.
process.on('unhandledRejection', (reason) => {
  console.error('[unhandledRejection]', reason);
});
process.on('uncaughtException', (error) => {
  console.error('[uncaughtException]', error);
});

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'forgeflow-backend' });
});

app.use('/api/idea', ideaRoutes);

// Central error handler — always returns clean JSON with a useful status/message.
app.use((err, _req, res, _next) => {
  const status = Number.isInteger(err?.status) && err.status >= 400 && err.status <= 599 ? err.status : 500;
  const message =
    status === 429
      ? err.message || 'The AI provider rate limit was hit. Please wait a moment and try again.'
      : status >= 500 && status < 600 && err.name === 'LLMError'
        ? err.message
        : status === 500
          ? 'Internal server error'
          : err.message || 'Request failed';

  console.error(`[error ${status}]`, err?.message || err);

  if (res.headersSent) {
    return;
  }
  res.status(status).json({ error: message });
});

const server = app.listen(PORT, () => {
  console.log(`ForgeFlow backend running on http://localhost:${PORT}`);
});

// Allow long multi-agent pipelines to finish without Node closing the socket.
server.requestTimeout = 0; // disable the 5-min default cap; we time out per-LLM-call instead
server.headersTimeout = 0;
server.keepAliveTimeout = 120000;

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(
      `Port ${PORT} is already in use. Stop the other process or set a different PORT in backend/.env.`,
    );
    process.exit(1);
  }

  throw err;
});
