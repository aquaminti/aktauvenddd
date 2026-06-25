import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { storage } from '../services/storage';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    setSubmissions(storage.getSubmissions());
  }, []);

  return (
    <div className="section">
      <div className="container dashboard">
        <div className="dashboard-header">
          <div>
            <p className="eyebrow">Личный кабинет</p>
            <h1 className="dashboard-title">Здравствуйте, {user?.name}</h1>
          </div>
          {user?.role === 'admin' && (
            <Link to="/admin" className="btn btn-primary">
              Панель администратора
            </Link>
          )}
        </div>

        <p className="dashboard-subtitle">
          Здесь хранится история ваших заявок. Данные восстанавливаются после обновления страницы.
        </p>

        <div className="dashboard-info-card">
          <div>
            <span className="contacts-info-label">Email</span>
            <p>{user?.email}</p>
          </div>
          <div>
            <span className="contacts-info-label">Роль</span>
            <p>{user?.role === 'admin' ? 'Администратор' : 'Клиент'}</p>
          </div>
        </div>

        <h2 className="dashboard-section-title">История заявок ({submissions.length})</h2>

        {submissions.length === 0 ? (
          <p className="map-empty-state">У вас пока нет отправленных заявок.</p>
        ) : (
          <div className="dashboard-submissions">
            {submissions.map((s, i) => (
              <div key={i} className="dashboard-submission-item">
                <div className="dashboard-submission-head">
                  <strong>{s.name}</strong>
                  <span className="dashboard-submission-date">
                    {new Date(s.savedAt).toLocaleString('ru-RU')}
                  </span>
                </div>
                <p>{s.message}</p>
                <span className="tag">{s.phone}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
