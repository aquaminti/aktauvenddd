const { isDatabaseConnected } = require('../database/connection');

function requireDatabase(req, res, next) {
  if (!isDatabaseConnected()) {
    return res.status(503).json({
      success: false,
      message: 'База данных временно недоступна. Попробуйте позже.',
    });
  }
  next();
}

module.exports = { requireDatabase };
