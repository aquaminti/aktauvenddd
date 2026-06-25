import { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Navbar.css';

const NAV_LINKS = [
  { to: '/', label: 'Главная' },
  { to: '/about', label: 'О компании' },
  { to: '/map', label: 'Карта автоматов' },
  { to: '/gallery', label: 'Галерея' },
  { to: '/contacts', label: 'Контакты' },
];

function AuthBlock({ isAuthenticated, user, onLogout, onClose, className }) {
  return (
    <div className={className}>
      {isAuthenticated ? (
        <>
          <NavLink to="/dashboard" className="navbar-link" onClick={onClose}>
            Кабинет
          </NavLink>
          {user?.role === 'admin' && (
            <NavLink to="/admin" className="navbar-link navbar-link-admin" onClick={onClose}>
              Админ
            </NavLink>
          )}
          <span className="navbar-user">{user.name.split(' ')[0]}</span>
          <button type="button" className="btn btn-secondary" onClick={onLogout}>
            Выйти
          </button>
        </>
      ) : (
        <>
          <NavLink to="/login" className="btn btn-secondary" onClick={onClose}>
            Вход
          </NavLink>
          <NavLink to="/register" className="btn btn-primary" onClick={onClose}>
            Регистрация
          </NavLink>
        </>
      )}
    </div>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    function onScroll() {
      setIsScrolled(window.scrollY > 12);
    }
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  return (
    <header className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container navbar-inner">
        <NavLink to="/" className="navbar-brand">
          <span className="navbar-brand-mark">AV</span>
          <span className="navbar-brand-text">AKTAUVEND</span>
        </NavLink>

        <nav className={`navbar-links ${isOpen ? 'is-open' : ''}`} aria-label="Основная навигация">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `navbar-link ${isActive ? 'is-active' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}

          <AuthBlock
            isAuthenticated={isAuthenticated}
            user={user}
            onLogout={handleLogout}
            onClose={() => setIsOpen(false)}
            className="navbar-auth navbar-auth-mobile"
          />
        </nav>

        <AuthBlock
          isAuthenticated={isAuthenticated}
          user={user}
          onLogout={handleLogout}
          className="navbar-auth navbar-auth-desktop"
        />

        <button
          type="button"
          className={`navbar-toggle ${isOpen ? 'is-open' : ''}`}
          aria-label="Открыть меню"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
