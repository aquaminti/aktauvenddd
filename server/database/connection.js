const mongoose = require('mongoose');
const { seedDatabase } = require('./seed');

async function connectDatabase() {
  const envUri = process.env.MONGODB_URI;
  const localUri = 'mongodb://127.0.0.1:27017/aktauvend';
  const uri = envUri || localUri;

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

    if (envUri && uri !== localUri && process.env.NODE_ENV !== 'production') {
      console.warn('[database] Попытка подключиться к локальной MongoDB вместо удалённой...');
      try {
        await mongoose.connect(localUri, {
          serverSelectionTimeoutMS: 5000,
        });
        await seedDatabase();
        return;
      } catch (localErr) {
        console.error('[database] Локальное подключение тоже не удалось:', localErr.message);
      }
    }

    console.error('[database] Сервер продолжит работу, но запросы к БД будут возвращать ошибку.');
  }
}

function isDatabaseConnected() {
  return mongoose.connection.readyState === 1;
}

module.exports = { connectDatabase, isDatabaseConnected };
