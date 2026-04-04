import { getUser, setUser, getAccessToken } from '../core/auth.js';
import { lsGetAll, lsSet } from '../storage/localStorage.js';
import { config } from '../config/config.js';

function normalize(u) {
  return {
    uid: u.uid || u.id,
    id: u.id || u.uid,
    firstName: u.first_name || u.firstName || '',
    lastName: u.last_name || u.lastName || '',
    email: u.email,
    address: u.address || { street: '', houseNumber: '', zipCode: '' },
  };
}

// ── Mock implementations ─────────────────────────────────────────────────────

function mockGetUserById(id) {
  const user = lsGetAll('users').find(u => u.id === String(id));
  return user ? normalize(user) : null;
}

function mockUpdateUser(id, data) {
  const users = lsGetAll('users');
  const index = users.findIndex(u => u.id === String(id));
  if (index === -1) throw new Error('User not found');
  users[index] = { ...users[index], ...data };
  lsSet('users', users);
  const { password: _pw, ...safeUser } = users[index];
  setUser(safeUser);
}

function mockChangePassword(id, oldPass, newPass) {
  const users = lsGetAll('users');
  const index = users.findIndex(u => u.id === String(id));
  if (index === -1) throw new Error('User not found');
  if (users[index].password !== oldPass) throw new Error('Current password is incorrect');
  users[index].password = newPass;
  lsSet('users', users);
  return true;
}

// ── Real API implementations ─────────────────────────────────────────────────

async function apiGetUserById(uid) {
  const res = await fetch(`${config.BASE_URL}/users/${uid}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAccessToken()}`,
    },
  });
  if (!res.ok) return null;
  return normalize(await res.json());
}

// ── Public API ───────────────────────────────────────────────────────────────

export async function getUserById(id) {
  return config.MOCK.user ? mockGetUserById(id) : apiGetUserById(id);
}

export async function updateUser(id, data) {
  if (!config.MOCK.user) throw new Error('Profile update not supported yet');
  mockUpdateUser(id, data);
}

export function changePassword(id, oldPass, newPass) {
  if (!config.MOCK.user) throw new Error('Password change not supported yet');
  return mockChangePassword(id, oldPass, newPass);
}
