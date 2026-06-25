const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Machine = require('../models/Machine');
const SiteStats = require('../models/SiteStats');
const { machines, defaultSiteStats, defaultAdmin } = require('./seedData');

async function seedDatabase() {
  const machineCount = await Machine.countDocuments();
  if (machineCount === 0) {
    await Machine.insertMany(machines);
    console.log(`[seed] Добавлено ${machines.length} точек автоматов`);
  }

  const statsDoc = await SiteStats.findOne({ slug: 'homepage' });
  if (!statsDoc) {
    await SiteStats.create(defaultSiteStats);
    console.log('[seed] Настройки статистики главной страницы созданы');
  }

  const adminExists = await User.findOne({ email: defaultAdmin.email });
  if (!adminExists) {
    const passwordHash = await bcrypt.hash(defaultAdmin.password, 10);
    await User.create({
      name: defaultAdmin.name,
      email: defaultAdmin.email,
      phone: defaultAdmin.phone,
      passwordHash,
      role: 'admin',
    });
    console.log(`[seed] Администратор создан: ${defaultAdmin.email}`);
  }
}

module.exports = { seedDatabase };
