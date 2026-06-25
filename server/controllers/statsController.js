const SiteStats = require('../models/SiteStats');
const User = require('../models/User');
const Submission = require('../models/Submission');
const { getMachinesList } = require('./machineController');
const { defaultSiteStats } = require('../database/seedData');
const { isDatabaseConnected } = require('../database/connection');

async function resolveStatsValues() {
  if (!isDatabaseConnected()) {
    const machines = await getMachinesList({ includeInactive: true });
    const totalPhotos = machines.reduce((sum, m) => sum + (m.photosCount || 0), 0);
    return defaultSiteStats.stats.map((item) => {
      if (!item.auto) return { ...item };
      if (item.key === 'points') return { ...item, value: machines.length };
      if (item.key === 'districts') {
        return { ...item, value: new Set(machines.map((m) => m.district)).size };
      }
      if (item.key === 'photos') return { ...item, value: totalPhotos };
      return { ...item };
    });
  }

  let doc = await SiteStats.findOne({ slug: 'homepage' });
  if (!doc) {
    doc = await SiteStats.create(defaultSiteStats);
  }

  const machines = await getMachinesList({ includeInactive: true });
  const totalPhotos = machines.reduce((sum, m) => sum + (m.photosCount || 0), 0);

  return doc.stats.map((item) => {
    const plain = item.toObject ? item.toObject() : { ...item };
    if (!plain.auto) return plain;
    if (plain.key === 'points') return { ...plain, value: machines.length };
    if (plain.key === 'districts') {
      return { ...plain, value: new Set(machines.map((m) => m.district)).size };
    }
    if (plain.key === 'photos') return { ...plain, value: totalPhotos };
    return plain;
  });
}

async function getPublicStats(req, res, next) {
  try {
    const stats = await resolveStatsValues();
    res.json({ success: true, stats });
  } catch (err) {
    next(err);
  }
}

async function getSiteStatsConfig(req, res, next) {
  try {
    let doc = await SiteStats.findOne({ slug: 'homepage' });
    if (!doc) {
      doc = await SiteStats.create(defaultSiteStats);
    }
    const resolved = await resolveStatsValues();
    res.json({ success: true, config: doc.stats, resolved });
  } catch (err) {
    next(err);
  }
}

async function updateSiteStats(req, res, next) {
  try {
    const { stats } = req.body;
    if (!Array.isArray(stats) || stats.length === 0) {
      return res.status(400).json({ success: false, message: 'Передайте массив stats' });
    }

    let doc = await SiteStats.findOne({ slug: 'homepage' });
    if (!doc) {
      doc = await SiteStats.create({ slug: 'homepage', stats });
    } else {
      doc.stats = stats;
      await doc.save();
    }

    const resolved = await resolveStatsValues();
    res.json({ success: true, config: doc.stats, resolved });
  } catch (err) {
    next(err);
  }
}

async function getAdminOverview(req, res, next) {
  try {
    const [totalUsers, adminUsers, clientUsers, totalSubmissions, newSubmissions, machines] =
      await Promise.all([
        User.countDocuments(),
        User.countDocuments({ role: 'admin' }),
        User.countDocuments({ role: 'client' }),
        Submission.countDocuments(),
        Submission.countDocuments({ status: 'new' }),
        getMachinesList({ includeInactive: true }),
      ]);

    const activeMachines = machines.filter((m) => m.status === 'active').length;
    const districts = new Set(machines.map((m) => m.district)).size;
    const totalPhotos = machines.reduce((sum, m) => sum + (m.photosCount || 0), 0);

    res.json({
      success: true,
      overview: {
        totalUsers,
        adminUsers,
        clientUsers,
        totalSubmissions,
        newSubmissions,
        totalMachines: machines.length,
        activeMachines,
        districts,
        totalPhotos,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function listUsers(req, res, next) {
  try {
    const users = await User.find().sort({ createdAt: -1 }).select('-passwordHash');
    res.json({
      success: true,
      count: users.length,
      users: users.map((u) => u.toSafeObject()),
    });
  } catch (err) {
    next(err);
  }
}

async function updateUserRole(req, res, next) {
  try {
    const { role } = req.body;
    if (!['client', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Недопустимая роль' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Пользователь не найден' });
    }

    if (user._id.toString() === req.user.id && role !== 'admin') {
      return res.status(400).json({ success: false, message: 'Нельзя понизить собственную роль' });
    }

    if (user.role === 'admin' && role === 'client') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return res.status(400).json({ success: false, message: 'Нельзя удалить последнего администратора' });
      }
    }

    user.role = role;
    await user.save();

    res.json({ success: true, user: user.toSafeObject() });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getPublicStats,
  getSiteStatsConfig,
  updateSiteStats,
  getAdminOverview,
  listUsers,
  updateUserRole,
};
