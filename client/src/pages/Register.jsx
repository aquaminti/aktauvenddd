import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/Toast';
import './AuthPages.css';

export default function Register() {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  function validate(values) {
    const next = {};
    if (!values.name.trim() || values.name.trim().length < 2) {
      next.name = 'Введите имя (минимум 2 символа)';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      next.email = 'Введите корректный email';
    }
    if (!values.password || values.password.length < 6) {
      next.password = 'Пароль должен содержать минимум 6 символов';
    }
    return next;
  }

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError('');
    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      await register(form);
      showToast('Регистрация прошла успешно. Добро пожаловать!', 'success');
      navigate('/', { replace: true });
    } catch (err) {
      setServerError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <p className="eyebrow">AKTAUVEND</p>
        <h1 className="auth-title">Создать аккаунт</h1>
        <p className="auth-subtitle">Зарегистрируйтесь, чтобы отслеживать историю заявок.</p>

        <form onSubmit={handleSubmit} noValidate className="auth-form">
          <div className="form-field">
            <label htmlFor="reg-name">Имя</label>
            <input
              id="reg-name"
              type="text"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Ваше имя"
              aria-invalid={Boolean(errors.name)}
            />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>

          <div className="form-field">
            <label htmlFor="reg-email">Email</label>
            <input
              id="reg-email"
              type="email"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="you@example.com"
              aria-invalid={Boolean(errors.email)}
            />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          <div className="form-field">
            <label htmlFor="reg-phone">Телефон (необязательно)</label>
            <input
              id="reg-phone"
              type="tel"
              value={form.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+7 700 000 00 00"
            />
          </div>

          <div className="form-field">
            <label htmlFor="reg-password">Пароль</label>
            <input
              id="reg-password"
              type="password"
              value={form.password}
              onChange={(e) => handleChange('password', e.target.value)}
              placeholder="Минимум 6 символов"
              aria-invalid={Boolean(errors.password)}
            />
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>

          {serverError && <div className="auth-server-error">{serverError}</div>}

          <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting}>
            {isSubmitting ? 'Создаём аккаунт…' : 'Зарегистрироваться'}
          </button>
        </form>

        <p className="auth-switch">
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </p>
      </div>
    </div>
  );
}
