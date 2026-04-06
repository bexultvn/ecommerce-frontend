import { apiGet } from './api.js';
import { config } from '../config/config.js';

function normalize(p) {
  const availableQuantity = p.available_quantity ?? 0;

  return {
    id: p.uid,
    name: p.name,
    description: p.description,
    price: typeof p.price === 'string' ? parseFloat(p.price) : p.price,
    availableQuantity,
    stock: availableQuantity,
    inStock: availableQuantity > 0,
    categoryName: null,
    image: null,
    createdAt: p.created_at,
    updatedAt: p.updated_at,
  };
}

export async function getAll() {
  const raw = config.MOCK.product
    ? []
    : await apiGet(config.API.feed, '/products/');

  return raw.map(normalize);
}

export async function getById(id) {
  try {
    const raw = await apiGet(config.API.feed, `/products/${id}`);
    return normalize(raw);
  } catch {
    return null;
  }
}

export async function getFeatured() {
  return (await getAll()).slice(0, 4);
}