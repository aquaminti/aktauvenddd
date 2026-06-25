import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <div className="footer-brand-row">
            <span className="navbar-brand-mark">AV</span>
            <span className="footer-brand-text">AKTAUVEND</span>
          </div>
          <p className="footer-tagline">
            Сеть современных автоматов питьевой воды в Актау. Удобный доступ к чистой воде —
            рядом с домом, работой и учёбой.
          </p>
        </div>

        <div className="footer-col">
          <span className="footer-col-title">Навигация</span>
          <Link to="/about">О компании</Link>
          <Link to="/map">Карта автоматов</Link>
          <Link to="/gallery">Галерея</Link>
          <Link to="/contacts">Контакты</Link>
        </div>

        <div className="footer-col">
          <span className="footer-col-title">Контакты</span>
          <a href="tel:+77000000000">+7 700 000 00 00</a>
          <a href="mailto:info@aktauvend.kz">info@aktauvend.kz</a>
          <span className="footer-static-text">г. Актау, Мангистауская область</span>
        </div>

        <div className="footer-col">
          <span className="footer-col-title">Режим работы</span>
          <span className="footer-static-text">Автоматы — 24/7</span>
          <span className="footer-static-text">Поддержка — Пн–Сб, 9:00–19:00</span>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>© {year} AKTAUVEND. Все права защищены.</span>
        <span className="footer-credit">Сайт разработан для производственной практики</span>
      </div>
    </footer>
  );
}
