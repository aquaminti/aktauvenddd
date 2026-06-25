const { body, validationResult } = require('express-validator');

function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array(),
    });
  }
  next();
}

const registerRules = [
  body('name').trim().isLength({ min: 2, max: 60 }).withMessage('Имя должно содержать от 2 до 60 символов'),
  body('email').trim().isEmail().withMessage('Введите корректный email').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Пароль должен содержать минимум 6 символов'),
  handleValidation,
];

const loginRules = [
  body('email').trim().isEmail().withMessage('Введите корректный email').normalizeEmail(),
  body('password').notEmpty().withMessage('Введите пароль'),
  handleValidation,
];

const submissionRules = [
  body('name').trim().isLength({ min: 2, max: 80 }).withMessage('Имя должно содержать от 2 до 80 символов'),
  body('phone')
    .trim()
    .custom((value) => value.replace(/\D/g, '').length >= 10)
    .withMessage('Введите корректный номер телефона'),
  body('message').trim().isLength({ min: 5, max: 1000 }).withMessage('Сообщение должно содержать от 5 до 1000 символов'),
  handleValidation,
];

const machineRules = [
  body('address').trim().isLength({ min: 3, max: 200 }).withMessage('Адрес обязателен'),
  body('district').trim().isLength({ min: 2, max: 100 }).withMessage('Район обязателен'),
  body('lat').isFloat({ min: -90, max: 90 }).withMessage('Укажите корректную широту'),
  body('lng').isFloat({ min: -180, max: 180 }).withMessage('Укажите корректную долготу'),
  body('photosCount').optional().isInt({ min: 0, max: 20 }).withMessage('Количество фото от 0 до 20'),
  body('status').optional().isIn(['active', 'inactive']).withMessage('Недопустимый статус'),
  handleValidation,
];

const roleRules = [
  body('role').isIn(['client', 'admin']).withMessage('Роль должна быть client или admin'),
  handleValidation,
];

const statsRules = [
  body('stats').isArray({ min: 1 }).withMessage('Передайте массив stats'),
  body('stats.*.key').notEmpty().withMessage('Ключ stat обязателен'),
  body('stats.*.label').notEmpty().withMessage('Подпись stat обязательна'),
  body('stats.*.value').isInt({ min: 0 }).withMessage('Значение stat должно быть числом'),
  handleValidation,
];

module.exports = {
  registerRules,
  loginRules,
  submissionRules,
  machineRules,
  roleRules,
  statsRules,
};
