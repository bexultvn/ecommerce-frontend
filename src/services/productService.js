import { lsGetAll } from '../storage/localStorage.js';

export function getAll(filters = {}) {
  let products = lsGetAll('products');

  if (filters.category) {
    products = products.filter(p => p.category === filters.category);
  }

  if (filters.search) {
    const q = filters.search.toLowerCase();
    products = products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
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
      case 'rating-desc':
        products.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }
  }

  return products;
}

export function getById(id) {
  const products = lsGetAll('products');
  return products.find(p => p.id === String(id)) || null;
}

export function getFeatured() {
  const products = lsGetAll('products');
  return products.slice(0, 4);
}
