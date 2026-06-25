const express = require('express');
const {
  listMachines,
  getMachineById,
  createMachine,
  updateMachine,
  deleteMachine,
} = require('../controllers/machineController');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { requireDatabase } = require('../middleware/requireDatabase');
const { machineRules } = require('../middleware/validators');

const router = express.Router();

router.get('/', listMachines);
router.get('/:id', getMachineById);

router.post('/', requireDatabase, requireAuth, requireAdmin, machineRules, createMachine);
router.put('/:id', requireDatabase, requireAuth, requireAdmin, updateMachine);
router.delete('/:id', requireDatabase, requireAuth, requireAdmin, deleteMachine);

module.exports = router;
