import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/Toast';
import './AuthPages.css';

export default function Login() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  function validate(values) {
    const next = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      next.email = 'Введите корректный email';
    }
    if (!values.password || values.password.length < 6) {
      next.password = 'Пароль должен содержать минимум 6 символов';
    }
    return next;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError('');
    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      await login(form);
      showToast('Вы успешно вошли в систему', 'success');
      const redirectTo = location.state?.from?.pathname || '/';
      navigate(redirectTo, { replace: true });
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
        <h1 className="auth-title">Вход в личный кабинет</h1>
        <p className="auth-subtitle">Войдите, чтобы отслеживать ваши заявки и обращения.</p>

        <form onSubmit={handleSubmit} noValidate className="auth-form">
          <div className="form-field">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              value={form.email}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, email: e.target.value }));
                setErrors((prev) => ({ ...prev, email: undefined }));
              }}
              placeholder="you@example.com"
              aria-invalid={Boolean(errors.email)}
            />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          <div className="form-field">
            <label htmlFor="login-password">Пароль</label>
            <input
              id="login-password"
              type="password"
              value={form.password}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, password: e.target.value }));
                setErrors((prev) => ({ ...prev, password: undefined }));
              }}
              placeholder="••••••••"
              aria-invalid={Boolean(errors.password)}
            />
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>

          {serverError && <div className="auth-server-error">{serverError}</div>}

          <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting}>
            {isSubmitting ? 'Входим…' : 'Войти'}
          </button>
        </form>

        <p className="auth-switch">
          Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
        </p>
      </div>
    </div>
  );
}
