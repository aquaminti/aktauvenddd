const mongoose = require('mongoose');

const machineSchema = new mongoose.Schema(
  {
    machineId: {
      type: Number,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    district: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: '',
    },
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    photosFolder: {
      type: String,
      required: true,
    },
    photosCount: {
      type: Number,
      default: 0,
      min: 0,
      max: 20,
    },
  },
  { timestamps: true }
);

machineSchema.methods.toPublicObject = function toPublicObject() {
  const photos = [];
  for (let i = 1; i <= this.photosCount; i += 1) {
    photos.push(`/images/${this.photosFolder}/${this.photosFolder}.${i}.png`);
  }
  return {
    id: this.machineId,
    machineId: this.machineId,
    _id: this._id,
    address: this.address,
    district: this.district,
    description: this.description,
    lat: this.lat,
    lng: this.lng,
    status: this.status,
    photosFolder: this.photosFolder,
    photosCount: this.photosCount,
    photos,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

module.exports = mongoose.model('Machine', machineSchema);
