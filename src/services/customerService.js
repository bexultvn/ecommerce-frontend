import { apiGet, apiPost, apiPut, apiDelete } from './api.js';
import { lsGetAll, lsSet } from '../storage/localStorage.js';
import { config } from '../config/config.js';

function normalize(c) {
  return {
    id: c.id,
    firstName: c.firstName,
    lastName: c.lastName,
    email: c.email,
    address: c.address || { street: '', houseNumber: '', zipCode: '' }
  };
}

export async function createCustomer(request) {
  if (config.USE_MOCK) {
    const users = lsGetAll('users');
    const newUser = { ...request, id: 'u' + Date.now() };
    users.push(newUser);
    lsSet('users', users);
    return newUser.id;
  }
  return apiPost('/customer', request);
}

export async function updateCustomer(request) {
  if (config.USE_MOCK) {
    const users = lsGetAll('users');
    const index = users.findIndex(u => u.id === String(request.id));
    if (index === -1) throw new Error('Customer not found');
    users[index] = { ...users[index], ...request };
    lsSet('users', users);
    return;
  }
  return apiPut('/customer', request);
}

export async function findAllCustomers() {
  if (config.USE_MOCK) {
    return lsGetAll('users').map(normalize);
  }
  return (await apiGet('/customer')).map(normalize);
}

export async function findCustomerById(id) {
  if (config.USE_MOCK) {
    const user = lsGetAll('users').find(u => u.id === String(id));
    return user ? normalize(user) : null;
  }
  try {
    return normalize(await apiGet(`/customer/${id}`));
  } catch {
    return null;
  }
}

export async function existsById(id) {
  if (config.USE_MOCK) {
    return lsGetAll('users').some(u => u.id === String(id));
  }
  return apiGet(`/customer/exists/${id}`);
}

export async function deleteCustomer(id) {
  if (config.USE_MOCK) {
    const users = lsGetAll('users').filter(u => u.id !== String(id));
    lsSet('users', users);
    return;
  }
  return apiDelete(`/customer/${id}`);
}
