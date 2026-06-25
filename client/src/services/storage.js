

const KEYS = {
  USER: 'aktauvend_user',
  TOKEN: 'aktauvend_token',
  SUBMISSIONS: 'aktauvend_submissions',
  CONTACT_DRAFT: 'aktauvend_contact_draft',
  GALLERY_FAVORITES: 'aktauvend_gallery_favorites',
};

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    console.warn(`[storage] Не удалось прочитать ключ "${key}":`, err.message);
    return fallback;
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.warn(`[storage] Не удалось записать ключ "${key}":`, err.message);
    return false;
  }
}

export const storage = {
  getUser: () => readJSON(KEYS.USER, null),
  setUser: (user) => writeJSON(KEYS.USER, user),
  clearUser: () => localStorage.removeItem(KEYS.USER),

  getToken: () => {
    try {
      return localStorage.getItem(KEYS.TOKEN);
    } catch {
      return null;
    }
  },
  setToken: (token) => {
    try {
      localStorage.setItem(KEYS.TOKEN, token);
    } catch {

    }
  },
  clearToken: () => localStorage.removeItem(KEYS.TOKEN),




  getSubmissions: () => readJSON(KEYS.SUBMISSIONS, []),
  addSubmission: (submission) => {
    const list = readJSON(KEYS.SUBMISSIONS, []);
    list.unshift({ ...submission, savedAt: new Date().toISOString() });
    writeJSON(KEYS.SUBMISSIONS, list.slice(0, 50));
  },



  getContactDraft: () => readJSON(KEYS.CONTACT_DRAFT, null),
  setContactDraft: (draft) => writeJSON(KEYS.CONTACT_DRAFT, draft),
  clearContactDraft: () => localStorage.removeItem(KEYS.CONTACT_DRAFT),


  getFavorites: () => readJSON(KEYS.GALLERY_FAVORITES, []),
  toggleFavorite: (machineId) => {
    const list = readJSON(KEYS.GALLERY_FAVORITES, []);
    const exists = list.includes(machineId);
    const next = exists ? list.filter((id) => id !== machineId) : [...list, machineId];
    writeJSON(KEYS.GALLERY_FAVORITES, next);
    return next;
  },
};
