require('dotenv').config();

const express = require('express');
const cors = require('cors');
const ideaRoutes = require('./routes/idea');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'forgeflow-backend' });
});

app.use('/api/idea', ideaRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

const server = app.listen(PORT, () => {
  console.log(`ForgeFlow backend running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(
      `Port ${PORT} is already in use. Stop the other process or set a different PORT in backend/.env.`,
    );
    process.exit(1);
  }

  throw err;
});
