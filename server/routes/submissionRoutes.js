const express = require('express');
const {
  createSubmission,
  listSubmissions,
  updateSubmissionStatus,
} = require('../controllers/submissionController');
const { requireAuth, attachUserIfPresent, requireAdmin } = require('../middleware/auth');
const { requireDatabase } = require('../middleware/requireDatabase');
const { submissionRules } = require('../middleware/validators');

const router = express.Router();

router.post('/', attachUserIfPresent, submissionRules, requireDatabase, createSubmission);
router.get('/', requireDatabase, requireAuth, requireAdmin, listSubmissions);
router.patch('/:id', requireDatabase, requireAuth, requireAdmin, updateSubmissionStatus);

module.exports = router;
