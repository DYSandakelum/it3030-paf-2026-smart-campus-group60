export const BASIC_AUTH_USERNAME_KEY = 'authUsername';
export const BASIC_AUTH_PASSWORD_KEY = 'authPassword';

export function getBasicAuthCredentials() {
  const username = localStorage.getItem(BASIC_AUTH_USERNAME_KEY);
  const password = localStorage.getItem(BASIC_AUTH_PASSWORD_KEY);

  if (!username || !password) {
    return null;
  }

  return { username, password };
}

export function applyBasicAuth(config = {}) {
  const credentials = getBasicAuthCredentials();

  if (credentials) {
    config.auth = credentials;
  } else if (config.auth) {
    delete config.auth;
  }

  return config;
}

export function clearAuthState() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem(BASIC_AUTH_USERNAME_KEY);
  localStorage.removeItem(BASIC_AUTH_PASSWORD_KEY);
}

export function normalizeUsername(username) {
  return String(username || '').trim().toLowerCase();
}

export function inferUserFromUsername(username) {
  const normalized = normalizeUsername(username);

  if (normalized === 'admin') {
    return { name: 'Admin User', email: 'admin', role: 'ADMIN' };
  }

  if (normalized === 'tech') {
    return { name: 'Technician User', email: 'tech', role: 'TECHNICIAN' };
  }

  return { name: 'Campus User', email: normalized || 'user', role: 'USER' };
}
