import { config } from '../config/config.js';
import { getAccessToken } from '../core/auth.js';

function getAuthHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  const token = getAccessToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export async function apiGet(path) {
  if (config.USE_MOCK) {
    console.log(`[Mock] GET ${path}`);
    throw new Error('Mock mode: use service layer directly');
  }
  const res = await fetch(`${config.BASE_URL}${path}`, {
    method: 'GET',
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  return res.json();
}

export async function apiPost(path, body) {
  if (config.USE_MOCK) {
    console.log(`[Mock] POST ${path}`, body);
    throw new Error('Mock mode: use service layer directly');
  }
  const res = await fetch(`${config.BASE_URL}${path}`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
  return res.json();
}

export async function apiPut(path, body) {
  if (config.USE_MOCK) {
    console.log(`[Mock] PUT ${path}`, body);
    throw new Error('Mock mode: use service layer directly');
  }
  const res = await fetch(`${config.BASE_URL}${path}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`PUT ${path} failed: ${res.status}`);
  return res.json();
}

export async function apiPatch(path, body) {
  if (config.USE_MOCK) {
    console.log(`[Mock] PATCH ${path}`, body);
    throw new Error('Mock mode: use service layer directly');
  }
  const res = await fetch(`${config.BASE_URL}${path}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`PATCH ${path} failed: ${res.status}`);
  return res.json();
}

export async function apiDelete(path) {
  if (config.USE_MOCK) {
    console.log(`[Mock] DELETE ${path}`);
    throw new Error('Mock mode: use service layer directly');
  }
  const res = await fetch(`${config.BASE_URL}${path}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error(`DELETE ${path} failed: ${res.status}`);
  if (res.status === 204) return null;
  return res.json();
}
