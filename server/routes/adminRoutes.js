const express = require('express');
const {
  getAdminOverview,
  listUsers,
  updateUserRole,
  getSiteStatsConfig,
  updateSiteStats,
} = require('../controllers/statsController');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { requireDatabase } = require('../middleware/requireDatabase');
const { roleRules, statsRules } = require('../middleware/validators');

const router = express.Router();

router.use(requireDatabase, requireAuth, requireAdmin);

router.get('/overview', getAdminOverview);
router.get('/users', listUsers);
router.patch('/users/:id/role', roleRules, updateUserRole);
router.get('/site-stats', getSiteStatsConfig);
router.put('/site-stats', statsRules, updateSiteStats);

module.exports = router;
