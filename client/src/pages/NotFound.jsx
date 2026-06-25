import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="section" style={{ textAlign: 'center', minHeight: '50vh' }}>
      <div className="container">
        <p className="eyebrow">Ошибка 404</p>
        <h1 style={{ fontSize: '2.4rem', marginTop: 8 }}>Страница не найдена</h1>
        <p style={{ color: 'var(--color-ink-soft)', marginTop: 12, marginBottom: 24 }}>
          Возможно, ссылка устарела или страница была перемещена.
        </p>
        <Link to="/" className="btn btn-primary">
          Вернуться на главную
        </Link>
      </div>
    </div>
  );
}
