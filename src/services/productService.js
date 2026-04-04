import { apiGet } from './api.js';
import { lsGetAll } from '../storage/localStorage.js';
import { config } from '../config/config.js';

function normalize(p) {
  return {
    id: p.uid || p.id,
    name: p.name,
    description: p.description,
    price: typeof p.price === 'string' ? parseFloat(p.price) : p.price,
    availableQuantity: p.available_quantity ?? p.availableQuantity ?? null,
    categoryName: p.categoryName || null,
    categoryId: p.categoryId || null,
    image: p.image || null
  };
}

export async function getAll(filters = {}) {
  const raw = config.MOCK.product
    ? lsGetAll('products')
    : await apiGet('/products');

  let products = raw.map(normalize);

  if (filters.category) {
    products = products.filter(p => p.categoryName === filters.category);
  }

  if (filters.search) {
    const q = filters.search.toLowerCase();
    products = products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (p.categoryName && p.categoryName.toLowerCase().includes(q))
    );
  }

  if (filters.minPrice !== undefined) {
    products = products.filter(p => p.price >= filters.minPrice);
  }

  if (filters.maxPrice !== undefined) {
    products = products.filter(p => p.price <= filters.maxPrice);
  }

  if (filters.sort) {
    switch (filters.sort) {
      case 'price-asc':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        products.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }
  }

  return products;
}

export async function getById(id) {
  if (config.MOCK.product) {
    const raw = lsGetAll('products').find(p => p.id === String(id));
    return raw ? normalize(raw) : null;
  }
  try {
    return normalize(await apiGet(`/products/${id}`));
  } catch {
    return null;
  }
}

export async function getFeatured() {
  return (await getAll()).slice(0, 4);
}
