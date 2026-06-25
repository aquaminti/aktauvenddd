const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Имя обязательно'],
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    phone: {
      type: String,
      required: [true, 'Телефон обязателен'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Сообщение обязательно'],
      trim: true,
      minlength: 5,
      maxlength: 1000,
    },
    source: {
      type: String,
      enum: ['contact_form', 'machine_card', 'partnership'],
      default: 'contact_form',
    },
    machineId: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ['new', 'in_progress', 'closed'],
      default: 'new',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Submission', submissionSchema);
