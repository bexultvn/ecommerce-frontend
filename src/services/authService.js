import { setUser, clearUser, getUser } from '../core/auth.js';
import { lsGetAll, lsSet } from '../storage/localStorage.js';

export function login(email, password) {
  const users = lsGetAll('users');
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    throw new Error('Invalid email or password');
  }
  const { password: _pw, ...safeUser } = user;
  setUser(safeUser);
  return safeUser;
}

export function register(data) {
  const { firstName, lastName, email, password } = data;
  const users = lsGetAll('users');

  const existing = users.find(u => u.email === email);
  if (existing) {
    throw new Error('An account with this email already exists');
  }

  const newUser = {
    id: 'u' + Date.now(),
    email,
    password,
    firstName,
    lastName,
    address: { street: '', houseNumber: '', zipCode: '' }
  };

  users.push(newUser);
  lsSet('users', users);

  const { password: _pw, ...safeUser } = newUser;
  setUser(safeUser);
  return safeUser;
}

export function logout() {
  clearUser();
}

export function getCurrentUser() {
  return getUser();
}
