import { updateCustomer, findCustomerById } from './customerService.js';
import { getUser, setUser } from '../core/auth.js';
import { lsGetAll, lsSet } from '../storage/localStorage.js';

export async function getUserById(id) {
  return findCustomerById(id);
}

export async function updateUser(id, data) {
  const user = getUser();
  const updatedRequest = { id: String(id), ...data };
  await updateCustomer(updatedRequest);

  // Refresh auth session with updated data (exclude password)
  const users = lsGetAll('users');
  const stored = users.find(u => u.id === String(id));
  if (stored) {
    const { password: _pw, ...safeUser } = stored;
    setUser(safeUser);
  } else if (user) {
    setUser({ ...user, ...data });
  }
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
