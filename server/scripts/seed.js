require('dotenv').config();
const mongoose = require('mongoose');
const { seedDatabase } = require('../database/seed');

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/aktauvend';

mongoose
  .connect(uri)
  .then(() => seedDatabase())
  .then(() => {
    console.log('[seed] Готово');
    process.exit(0);
  })
  .catch((err) => {
    console.error('[seed] Ошибка:', err.message);
    process.exit(1);
  });
