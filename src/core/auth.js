import { eventBus } from './eventBus.js';

const AUTH_KEY = 'auth_user';

export function getUser() {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setUser(user) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  eventBus.emit('auth:changed', user);
}

export function clearUser() {
  localStorage.removeItem(AUTH_KEY);
  eventBus.emit('auth:changed', null);
}

export function getAccessToken() {
  const user = getUser();
  return user ? user.access_token : null;
}

export function isLoggedIn() {
  return getUser() !== null;
}
