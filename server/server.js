require('dotenv').config();

if (!process.env.JWT_SECRET) {
  if (process.env.NODE_ENV === 'production') {
    console.error('[server] JWT_SECRET обязателен в production');
    process.exit(1);
  }
  process.env.JWT_SECRET = 'dev-aktauvend-jwt-secret-change-in-production';
  console.warn('[server] JWT_SECRET не задан — используется значение для разработки');
}

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

const { connectDatabase, isDatabaseConnected } = require('./database/connection');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const machineRoutes = require('./routes/machineRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const statsRoutes = require('./routes/statsRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    service: 'AKTAUVEND API',
    database: isDatabaseConnected() ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/machines', machineRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/admin', adminRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

connectDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`[server] AKTAUVEND API запущен на порту ${PORT}`);
  });
});
