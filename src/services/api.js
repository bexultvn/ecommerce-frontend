import { getAccessToken } from '../core/auth.js';

function getAuthHeaders() {
  const headers = {
    'Content-Type': 'application/json',
  };

  const token = getAccessToken();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

async function handleResponse(res) {
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(
      data?.detail ||
      data?.message ||
      `Request failed: ${res.status}`
    );
  }

  return data;
}

export async function apiGet(baseUrl, path) {
  const res = await fetch(`${baseUrl}${path}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  return handleResponse(res);
}

export async function apiPost(baseUrl, path, body) {
  const res = await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });

  return handleResponse(res);
}

export async function apiPut(baseUrl, path, body) {
  const res = await fetch(`${baseUrl}${path}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });

  return handleResponse(res);
}

export async function apiPatch(baseUrl, path, body) {
  const res = await fetch(`${baseUrl}${path}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });

  return handleResponse(res);
}

export async function apiDelete(baseUrl, path) {
  const res = await fetch(`${baseUrl}${path}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (res.status === 204) return null;

  return handleResponse(res);
}