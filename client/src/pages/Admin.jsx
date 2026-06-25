import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  fetchAdminOverview,
  fetchAdminUsers,
  updateUserRole,
  fetchSiteStatsConfig,
  updateSiteStats,
  fetchSubmissions,
  updateSubmissionStatus,
  createMachine,
  updateMachine,
  deleteMachine,
  fetchMachines,
} from '../services/api';
import { useToast } from '../components/Toast';
import './Admin.css';

const TABS = [
  { id: 'overview', label: 'Обзор' },
  { id: 'machines', label: 'Автоматы' },
  { id: 'users', label: 'Пользователи' },
  { id: 'stats', label: 'Статистика' },
  { id: 'submissions', label: 'Заявки' },
];

const EMPTY_MACHINE = {
  address: '',
  district: '',
  description: '',
  lat: 43.65,
  lng: 51.17,
  status: 'active',
  photosCount: 0,
};

const STATUS_LABELS = {
  new: 'Новая',
  in_progress: 'В работе',
  closed: 'Закрыта',
};

export default function Admin() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [statsConfig, setStatsConfig] = useState([]);
  const [resolvedStats, setResolvedStats] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [machines, setMachines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [machineForm, setMachineForm] = useState(EMPTY_MACHINE);
  const [editingId, setEditingId] = useState(null);
  const [userSearch, setUserSearch] = useState('');

  async function loadOverview() {
    const data = await fetchAdminOverview();
    setOverview(data.overview);
  }

  async function loadUsers() {
    const data = await fetchAdminUsers();
    setUsers(data.users);
  }

  async function loadStats() {
    const data = await fetchSiteStatsConfig();
    setStatsConfig(data.config);
    setResolvedStats(data.resolved);
  }

  async function loadSubmissions() {
    const data = await fetchSubmissions();
    setSubmissions(data.submissions);
  }

  async function loadMachines() {
    const data = await fetchMachines();
    setMachines(data.machines);
  }

  useEffect(() => {
    async function init() {
      setIsLoading(true);
      try {
        await Promise.all([loadOverview(), loadUsers(), loadStats(), loadSubmissions(), loadMachines()]);
      } catch (err) {
        showToast(err.message, 'error');
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, []);

  async function handleRoleChange(userId, role) {
    try {
      const data = await updateUserRole(userId, role);
      setUsers((prev) => prev.map((u) => (u.id === data.user.id ? data.user : u)));
      showToast('Роль пользователя обновлена');
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  async function handleStatsSave(e) {
    e.preventDefault();
    try {
      const data = await updateSiteStats(statsConfig);
      setStatsConfig(data.config);
      setResolvedStats(data.resolved);
      showToast('Статистика главной страницы сохранена');
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  function updateStatField(index, field, value) {
    setStatsConfig((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  }

  async function handleSubmissionStatus(id, status) {
    try {
      const data = await updateSubmissionStatus(id, status);
      setSubmissions((prev) => prev.map((s) => (s._id === id ? data.submission : s)));
      showToast('Статус заявки обновлён');
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  async function handleMachineSubmit(e) {
    e.preventDefault();
    try {
      if (editingId) {
        const data = await updateMachine(editingId, machineForm);
        setMachines((prev) => prev.map((m) => (m.id === editingId ? data.machine : m)));
        showToast('Точка автомата обновлена');
      } else {
        const data = await createMachine(machineForm);
        setMachines((prev) => [...prev, data.machine].sort((a, b) => a.id - b.id));
        showToast('Новая точка автомата добавлена');
      }
      setMachineForm(EMPTY_MACHINE);
      setEditingId(null);
      await loadOverview();
      await loadStats();
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  function startEditMachine(machine) {
    setEditingId(machine.id);
    setMachineForm({
      address: machine.address,
      district: machine.district,
      description: machine.description || '',
      lat: machine.lat,
      lng: machine.lng,
      status: machine.status,
      photosCount: machine.photosCount || 0,
    });
  }

  async function handleDeleteMachine(id) {
    if (!window.confirm('Удалить эту точку автомата?')) return;
    try {
      await deleteMachine(id);
      setMachines((prev) => prev.filter((m) => m.id !== id));
      if (editingId === id) {
        setEditingId(null);
        setMachineForm(EMPTY_MACHINE);
      }
      showToast('Точка удалена');
      await loadOverview();
      await loadStats();
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="section">
        <div className="container route-loading">
          <div className="spinner" aria-hidden="true" />
          <span>Загрузка панели администратора…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="section admin-page">
      <div className="container">
        <div className="admin-header">
          <div>
            <p className="eyebrow">Администрирование</p>
            <h1 className="admin-title">Панель управления AKTAUVEND</h1>
          </div>
          <Link to="/dashboard" className="btn btn-secondary">
            Личный кабинет
          </Link>
        </div>

        <div className="admin-tabs" role="tablist">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`admin-tab ${activeTab === tab.id ? 'is-active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && overview && (
          <div className="admin-panel">
            <div className="admin-cards">
              <div className="admin-card">
                <span className="admin-card-label">Пользователей</span>
                <strong className="admin-card-value">{overview.totalUsers}</strong>
                <span className="admin-card-meta">
                  админов: {overview.adminUsers} · клиентов: {overview.clientUsers}
                </span>
              </div>
              <div className="admin-card">
                <span className="admin-card-label">Точек автоматов</span>
                <strong className="admin-card-value">{overview.totalMachines}</strong>
                <span className="admin-card-meta">активных: {overview.activeMachines}</span>
              </div>
              <div className="admin-card">
                <span className="admin-card-label">Районов</span>
                <strong className="admin-card-value">{overview.districts}</strong>
                <span className="admin-card-meta">фото в галерее: {overview.totalPhotos}</span>
              </div>
              <div className="admin-card">
                <span className="admin-card-label">Заявок</span>
                <strong className="admin-card-value">{overview.totalSubmissions}</strong>
                <span className="admin-card-meta">новых: {overview.newSubmissions}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'machines' && (
          <div className="admin-panel admin-split">
            <form className="admin-form" onSubmit={handleMachineSubmit}>
              <h2>{editingId ? `Редактирование точки #${editingId}` : 'Новая точка автомата'}</h2>
              <label className="admin-field">
                <span>Адрес</span>
                <input
                  required
                  value={machineForm.address}
                  onChange={(e) => setMachineForm({ ...machineForm, address: e.target.value })}
                />
              </label>
              <label className="admin-field">
                <span>Район</span>
                <input
                  required
                  value={machineForm.district}
                  onChange={(e) => setMachineForm({ ...machineForm, district: e.target.value })}
                />
              </label>
              <label className="admin-field">
                <span>Описание</span>
                <textarea
                  rows={3}
                  value={machineForm.description}
                  onChange={(e) => setMachineForm({ ...machineForm, description: e.target.value })}
                />
              </label>
              <div className="admin-row">
                <label className="admin-field">
                  <span>Широта</span>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={machineForm.lat}
                    onChange={(e) => setMachineForm({ ...machineForm, lat: Number(e.target.value) })}
                  />
                </label>
                <label className="admin-field">
                  <span>Долгота</span>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={machineForm.lng}
                    onChange={(e) => setMachineForm({ ...machineForm, lng: Number(e.target.value) })}
                  />
                </label>
              </div>
              <div className="admin-row">
                <label className="admin-field">
                  <span>Статус</span>
                  <select
                    value={machineForm.status}
                    onChange={(e) => setMachineForm({ ...machineForm, status: e.target.value })}
                  >
                    <option value="active">Активен</option>
                    <option value="inactive">Неактивен</option>
                  </select>
                </label>
                <label className="admin-field">
                  <span>Кол-во фото</span>
                  <input
                    type="number"
                    min={0}
                    max={20}
                    value={machineForm.photosCount}
                    onChange={(e) =>
                      setMachineForm({ ...machineForm, photosCount: Number(e.target.value) })
                    }
                  />
                </label>
              </div>
              <div className="admin-form-actions">
                <button type="submit" className="btn btn-primary">
                  {editingId ? 'Сохранить' : 'Добавить'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setEditingId(null);
                      setMachineForm(EMPTY_MACHINE);
                    }}
                  >
                    Отмена
                  </button>
                )}
              </div>
            </form>

            <div className="admin-table-wrap">
              <h2>Список точек ({machines.length})</h2>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Адрес</th>
                    <th>Район</th>
                    <th>Статус</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {machines.map((m) => (
                    <tr key={m.id}>
                      <td>{m.id}</td>
                      <td>{m.address}</td>
                      <td>{m.district}</td>
                      <td>
                        <span className={`tag ${m.status === 'active' ? 'tag-success' : ''}`}>
                          {m.status === 'active' ? 'Активен' : 'Неактивен'}
                        </span>
                      </td>
                      <td className="admin-actions">
                        <button type="button" className="btn btn-secondary btn-sm" onClick={() => startEditMachine(m)}>
                          Изменить
                        </button>
                        <button type="button" className="btn btn-secondary btn-sm" onClick={() => handleDeleteMachine(m.id)}>
                          Удалить
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="admin-panel">
            <input
              className="admin-search"
              placeholder="Поиск по имени или email"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
            />
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Имя</th>
                    <th>Email</th>
                    <th>Роль</th>
                    <th>Дата регистрации</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`tag ${u.role === 'admin' ? 'tag-success' : ''}`}>
                          {u.role === 'admin' ? 'Администратор' : 'Клиент'}
                        </span>
                      </td>
                      <td>{new Date(u.createdAt).toLocaleDateString('ru-RU')}</td>
                      <td>
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          className="admin-select-inline"
                        >
                          <option value="client">Клиент</option>
                          <option value="admin">Администратор</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="admin-panel admin-split">
            <form className="admin-form" onSubmit={handleStatsSave}>
              <h2>Настройки блока статистики</h2>
              <p className="admin-hint">
                Включите «Авто» для автоматического подсчёта из базы данных. Иначе используется
                заданное значение.
              </p>
              {statsConfig.map((item, index) => (
                <div key={item.key} className="admin-stat-row">
                  <strong>{item.key}</strong>
                  <label className="admin-field">
                    <span>Подпись</span>
                    <input
                      value={item.label}
                      onChange={(e) => updateStatField(index, 'label', e.target.value)}
                    />
                  </label>
                  <label className="admin-field">
                    <span>Значение</span>
                    <input
                      type="number"
                      min={0}
                      value={item.value}
                      disabled={item.auto}
                      onChange={(e) => updateStatField(index, 'value', Number(e.target.value))}
                    />
                  </label>
                  <label className="admin-field">
                    <span>Суффикс</span>
                    <input
                      value={item.suffix || ''}
                      onChange={(e) => updateStatField(index, 'suffix', e.target.value)}
                    />
                  </label>
                  <label className="admin-checkbox">
                    <input
                      type="checkbox"
                      checked={Boolean(item.auto)}
                      onChange={(e) => updateStatField(index, 'auto', e.target.checked)}
                    />
                    Авто из БД
                  </label>
                </div>
              ))}
              <button type="submit" className="btn btn-primary">
                Сохранить статистику
              </button>
            </form>

            <div className="admin-preview">
              <h2>Предпросмотр на главной</h2>
              <div className="admin-preview-grid">
                {resolvedStats.map((item) => (
                  <div key={item.key} className="admin-preview-card">
                    <strong>
                      {item.value}
                      {item.suffix}
                    </strong>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'submissions' && (
          <div className="admin-panel">
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Дата</th>
                    <th>Имя</th>
                    <th>Телефон</th>
                    <th>Сообщение</th>
                    <th>Статус</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((s) => (
                    <tr key={s._id}>
                      <td>{new Date(s.createdAt).toLocaleString('ru-RU')}</td>
                      <td>{s.name}</td>
                      <td>{s.phone}</td>
                      <td className="admin-message-cell">{s.message}</td>
                      <td>
                        <select
                          value={s.status}
                          onChange={(e) => handleSubmissionStatus(s._id, e.target.value)}
                          className="admin-select-inline"
                        >
                          {Object.entries(STATUS_LABELS).map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
