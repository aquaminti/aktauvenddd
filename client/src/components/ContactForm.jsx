import { useEffect, useState } from 'react';
import { submitContactForm } from '../services/api';
import { storage } from '../services/storage';
import { useToast } from './Toast';
import './ContactForm.css';

function formatPhoneInput(rawValue) {

  const digits = rawValue.replace(/\D/g, '').replace(/^7?/, '').slice(0, 10);
  let formatted = '+7';
  if (digits.length > 0) formatted += ` (${digits.slice(0, 3)}`;
  if (digits.length >= 3) formatted += `) ${digits.slice(3, 6)}`;
  if (digits.length >= 6) formatted += `-${digits.slice(6, 8)}`;
  if (digits.length >= 8) formatted += `-${digits.slice(8, 10)}`;
  return formatted;
}

export default function ContactForm({ machineId = null, compact = false }) {
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: '', phone: '', message: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);


  useEffect(() => {
    const draft = storage.getContactDraft();
    if (draft && !machineId) {
      setForm(draft);
    }
  }, [machineId]);

  useEffect(() => {
    if (!machineId) {
      storage.setContactDraft(form);
    }
  }, [form, machineId]);

  function validate(values) {
    const nextErrors = {};
    if (!values.name.trim() || values.name.trim().length < 2) {
      nextErrors.name = 'Введите имя (минимум 2 символа)';
    }
    const phoneDigits = values.phone.replace(/\D/g, '');
    if (phoneDigits.length < 11) {
      nextErrors.phone = 'Введите полный номер телефона';
    }
    if (!values.message.trim() || values.message.trim().length < 5) {
      nextErrors.message = 'Сообщение должно содержать минимум 5 символов';
    }
    return nextErrors;
  }

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function handlePhoneChange(e) {
    handleChange('phone', formatPhoneInput(e.target.value));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    const payload = { ...form, source: machineId ? 'machine_card' : 'contact_form', machineId };

    try {
      await submitContactForm(payload);
      storage.addSubmission(payload);
      showToast('Заявка успешно отправлена. Мы свяжемся с вами в ближайшее время.', 'success');
      setForm({ name: '', phone: '', message: '' });
      if (!machineId) storage.clearContactDraft();
    } catch (err) {


      storage.addSubmission(payload);
      showToast(
        'Не удалось связаться с сервером. Заявка сохранена локально и будет отправлена позже.',
        'error'
      );
      console.warn('[ContactForm]', err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className={`contact-form ${compact ? 'contact-form-compact' : ''}`} onSubmit={handleSubmit} noValidate>
      <div className="form-field">
        <label htmlFor={`name-${machineId || 'main'}`}>Имя</label>
        <input
          id={`name-${machineId || 'main'}`}
          type="text"
          value={form.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Как к вам обращаться?"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? `name-error-${machineId || 'main'}` : undefined}
        />
        {errors.name && (
          <span className="form-error" id={`name-error-${machineId || 'main'}`}>
            {errors.name}
          </span>
        )}
      </div>

      <div className="form-field">
        <label htmlFor={`phone-${machineId || 'main'}`}>Телефон</label>
        <input
          id={`phone-${machineId || 'main'}`}
          type="tel"
          value={form.phone}
          onChange={handlePhoneChange}
          placeholder="+7 (700) 000-00-00"
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={errors.phone ? `phone-error-${machineId || 'main'}` : undefined}
        />
        {errors.phone && (
          <span className="form-error" id={`phone-error-${machineId || 'main'}`}>
            {errors.phone}
          </span>
        )}
      </div>

      <div className="form-field">
        <label htmlFor={`message-${machineId || 'main'}`}>Сообщение</label>
        <textarea
          id={`message-${machineId || 'main'}`}
          rows={compact ? 3 : 5}
          value={form.message}
          onChange={(e) => handleChange('message', e.target.value)}
          placeholder={
            machineId
              ? 'Опишите проблему или предложение по этому автомату'
              : 'Расскажите, что вас интересует'
          }
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? `message-error-${machineId || 'main'}` : undefined}
        />
        {errors.message && (
          <span className="form-error" id={`message-error-${machineId || 'main'}`}>
            {errors.message}
          </span>
        )}
      </div>

      <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting}>
        {isSubmitting ? 'Отправка…' : 'Отправить заявку'}
      </button>
    </form>
  );
}
