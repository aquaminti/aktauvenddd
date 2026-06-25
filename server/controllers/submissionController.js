const Submission = require('../models/Submission');

async function createSubmission(req, res, next) {
  try {
    const { name, phone, message, source, machineId } = req.body;

    if (!name || !phone || !message) {
      return res.status(400).json({ success: false, message: 'Имя, телефон и сообщение обязательны' });
    }

    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      return res.status(400).json({ success: false, message: 'Введите корректный номер телефона' });
    }

    const submission = await Submission.create({
      name: name.trim(),
      phone: phone.trim(),
      message: message.trim(),
      source: source || 'contact_form',
      machineId: machineId || null,
      user: req.user ? req.user.id : null,
    });

    res.status(201).json({
      success: true,
      message: 'Заявка успешно отправлена. Мы свяжемся с вами в ближайшее время.',
      submission,
    });
  } catch (err) {
    next(err);
  }
}

async function listSubmissions(req, res, next) {
  try {
    const submissions = await Submission.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(200);
    res.json({ success: true, count: submissions.length, submissions });
  } catch (err) {
    next(err);
  }
}

async function updateSubmissionStatus(req, res, next) {
  try {
    const { status } = req.body;
    if (!['new', 'in_progress', 'closed'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Недопустимый статус' });
    }

    const submission = await Submission.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user', 'name email');

    if (!submission) {
      return res.status(404).json({ success: false, message: 'Заявка не найдена' });
    }

    res.json({ success: true, submission });
  } catch (err) {
    next(err);
  }
}

module.exports = { createSubmission, listSubmissions, updateSubmissionStatus };
