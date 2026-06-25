const express = require('express');
const { register, login, logout, me } = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');
const { requireDatabase } = require('../middleware/requireDatabase');
const { registerRules, loginRules } = require('../middleware/validators');

const router = express.Router();

router.post('/register', registerRules, requireDatabase, register);
router.post('/login', loginRules, requireDatabase, login);
router.post('/logout', logout);
router.get('/me', requireDatabase, requireAuth, me);

module.exports = router;
