export function lsGet(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function lsSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('lsSet error:', err);
  }
}

export function lsRemove(key) {
  localStorage.removeItem(key);
}

export function lsGetAll(key) {
  const value = lsGet(key);
  return Array.isArray(value) ? value : [];
}

export function seedIfEmpty(key, data) {
  const existing = localStorage.getItem(key);
  if (existing === null || existing === undefined) {
    lsSet(key, data);
  }
}

// Alias used in main.js
export function seedStorage(key, data) {
  seedIfEmpty(key, data);
}
