const mongoose = require('mongoose');
const { seedDatabase } = require('./seed');

async function connectDatabase() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/aktauvend';

  mongoose.connection.on('connected', () => {
    console.log('[database] Соединение с MongoDB установлено');
  });

  mongoose.connection.on('error', (err) => {
    console.error('[database] Ошибка соединения с MongoDB:', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('[database] Соединение с MongoDB потеряно');
  });

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    await seedDatabase();
  } catch (err) {
    console.error('[database] Не удалось подключиться к MongoDB:', err.message);
    console.error('[database] Сервер продолжит работу, но запросы к БД будут возвращать ошибку.');
  }
}

function isDatabaseConnected() {
  return mongoose.connection.readyState === 1;
}

module.exports = { connectDatabase, isDatabaseConnected };
