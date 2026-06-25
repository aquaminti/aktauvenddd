import { storage } from './storage';

const rawApiBase = import.meta.env.VITE_API_URL;
const API_BASE = rawApiBase ? rawApiBase.replace(/\/+$/, '') : '/api';
const API_ORIGIN = API_BASE.startsWith('http') ? API_BASE.replace(/\/api$/, '') : '';

export function buildBackendUrl(path) {
  if (!path) return path;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('/images/') && API_ORIGIN) {
    return `${API_ORIGIN}${path}`;
  }
  return path;
}

async function request(path, options = {}) {
  const token = storage.getToken();
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  let data;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message = (data && data.message) || `Ошибка запроса: ${response.status}`;
    throw new Error(message);
  }

  return data;
}

export const api = {
  get: (path) => request(path, { method: 'GET' }),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
  patch: (path, body) => request(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (path) => request(path, { method: 'DELETE' }),
};

export function fetchMachines(params = {}) {
  const query = new URLSearchParams(params).toString();
  return api.get(`/machines${query ? `?${query}` : ''}`);
}

export function fetchMachineById(id) {
  return api.get(`/machines/${id}`);
}

export function createMachine(payload) {
  return api.post('/machines', payload);
}

export function updateMachine(id, payload) {
  return api.put(`/machines/${id}`, payload);
}

export function deleteMachine(id) {
  return api.delete(`/machines/${id}`);
}

export function fetchWeather() {
  return api.get('/weather');
}

export function fetchPublicStats() {
  return api.get('/stats');
}

export function submitContactForm(payload) {
  return api.post('/submissions', payload);
}

export function registerUser(payload) {
  return api.post('/auth/register', payload);
}

export function loginUser(payload) {
  return api.post('/auth/login', payload);
}

export function logoutUser() {
  return api.post('/auth/logout', {});
}

export function fetchCurrentUser() {
  return api.get('/auth/me');
}

export function fetchAdminOverview() {
  return api.get('/admin/overview');
}

export function fetchAdminUsers() {
  return api.get('/admin/users');
}

export function updateUserRole(userId, role) {
  return api.patch(`/admin/users/${userId}/role`, { role });
}

export function fetchSiteStatsConfig() {
  return api.get('/admin/site-stats');
}

export function updateSiteStats(stats) {
  return api.put('/admin/site-stats', { stats });
}

export function fetchSubmissions() {
  return api.get('/submissions');
}

export function updateSubmissionStatus(id, status) {
  return api.patch(`/submissions/${id}`, { status });
}
