import { setUser, clearUser, getUser } from '../core/auth.js';
import { config } from '../config/config.js';
import { lsGetAll, lsSet } from '../storage/localStorage.js';

// ── Mock implementation ──────────────────────────────────────────────────────

function mockLogin(email, password) {
  const users = lsGetAll('users');
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) throw new Error('Invalid email or password');
  const { password: _pw, ...safeUser } = user;
  setUser(safeUser);
  return safeUser;
}

function mockRegister({ firstName, lastName, email, password }) {
  const users = lsGetAll('users');
  if (users.find(u => u.email === email)) {
    throw new Error('An account with this email already exists');
  }
  const newUser = {
    id: 'u' + Date.now(),
    email,
    password,
    firstName,
    lastName,
    address: { street: '', houseNumber: '', zipCode: '' },
  };
  users.push(newUser);
  lsSet('users', users);
  const { password: _pw, ...safeUser } = newUser;
  setUser(safeUser);
  return safeUser;
}

// ── Real API implementation ──────────────────────────────────────────────────

async function apiLogin(email, password) {
  const res = await fetch(`${config.BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'Invalid credentials');
  }
  const data = await res.json();
  setUser({
    uid: data.user.uid,
    email: data.user.email,
    access_token: data.access_token,
    refresh_token: data.refresh_token,
  });
  return data.user;
}

async function apiRegister({ firstName, lastName, email, password }) {
  const res = await fetch(`${config.BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ first_name: firstName, last_name: lastName, email, password }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'Registration failed');
  }
  return apiLogin(email, password);
}

// ── Public API ───────────────────────────────────────────────────────────────

export async function login(email, password) {
  return config.MOCK.auth ? mockLogin(email, password) : apiLogin(email, password);
}

export async function register(data) {
  return config.MOCK.auth ? mockRegister(data) : apiRegister(data);
}

export function logout() {
  clearUser();
}

export function getCurrentUser() {
  return getUser();
}
