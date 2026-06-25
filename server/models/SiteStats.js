const mongoose = require('mongoose');

const statItemSchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    label: { type: String, required: true },
    value: { type: Number, required: true, min: 0 },
    suffix: { type: String, default: '' },
    auto: { type: Boolean, default: false },
  },
  { _id: false }
);

const siteStatsSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      default: 'homepage',
      unique: true,
    },
    stats: {
      type: [statItemSchema],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SiteStats', siteStatsSchema);
