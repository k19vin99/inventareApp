const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
const itemsRouter = require('./items.routes');
const authRouter = require('./auth.routes');
const usersRouter = require('./users.routes');
const companiesRouter = require('./companies.routes');
const { requireAuth } = require('./middleware/auth');

app.use('/api', itemsRouter);
app.use('/api', authRouter);

// 🔒 Proteger el listado de usuarios con JWT
app.use('/api', requireAuth, usersRouter);
app.use('/api', requireAuth, companiesRouter);

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'inventareapp-backend' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend escuchando en http://localhost:${PORT}`);
});