import { apiGet, apiPost, apiPut, apiDelete } from './api.js';
import { lsGetAll, lsSet } from '../storage/localStorage.js';
import { config } from '../config/config.js';

function normalize(c) {
  return {
    id: c.id,
    firstName: c.firstName || c.firstname,
    lastName: c.lastName || c.lastname,
    email: c.email,
    address: c.address || { street: '', houseNumber: '', zipCode: '' }
  };
}

function denormalize(c) {
  return {
    id: c.id,
    firstname: c.firstName,
    lastname: c.lastName,
    email: c.email,
    address: c.address
  };
}

export async function createCustomer(request) {
  if (config.MOCK.customer) {
    const users = lsGetAll('users');
    const newUser = { ...request, id: 'u' + Date.now() };
    users.push(newUser);
    lsSet('users', users);
    return newUser.id;
  }
  return apiPost('/customer', denormalize(request));
}

export async function updateCustomer(request) {
  if (config.MOCK.customer) {
    const users = lsGetAll('users');
    const index = users.findIndex(u => u.id === String(request.id));
    if (index === -1) throw new Error('Customer not found');
    users[index] = { ...users[index], ...request };
    lsSet('users', users);
    return;
  }
  return apiPut('/customer', denormalize(request));
}

export async function findAllCustomers() {
  if (config.MOCK.customer) {
    return lsGetAll('users').map(normalize);
  }
  return (await apiGet('/customer')).map(normalize);
}

export async function findCustomerById(id) {
  if (config.MOCK.customer) {
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
  if (config.MOCK.customer) {
    return lsGetAll('users').some(u => u.id === String(id));
  }
  return apiGet(`/customer/exists/${id}`);
}

export async function deleteCustomer(id) {
  if (config.MOCK.customer) {
    const users = lsGetAll('users').filter(u => u.id !== String(id));
    lsSet('users', users);
    return;
  }
  return apiDelete(`/customer/${id}`);
}
