import { lsGetAll, lsSet } from '../storage/localStorage.js';
import { getUser, setUser } from '../core/auth.js';

export function getUser_ById(id) {
  const users = lsGetAll('users');
  return users.find(u => u.id === String(id)) || null;
}

export function updateUser(id, data) {
  const users = lsGetAll('users');
  const index = users.findIndex(u => u.id === String(id));
  if (index === -1) throw new Error('User not found');

  const updatedUser = { ...users[index], ...data };
  users[index] = updatedUser;
  lsSet('users', users);

  // Update auth session (exclude password)
  const { password: _pw, ...safeUser } = updatedUser;
  setUser(safeUser);

  return safeUser;
}

export function changePassword(id, oldPass, newPass) {
  const users = lsGetAll('users');
  const index = users.findIndex(u => u.id === String(id));
  if (index === -1) throw new Error('User not found');

  if (users[index].password !== oldPass) {
    throw new Error('Current password is incorrect');
  }

  users[index].password = newPass;
  lsSet('users', users);
  return true;
}
