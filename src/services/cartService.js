import { lsGetAll, lsSet } from '../storage/localStorage.js';
import { eventBus } from '../core/eventBus.js';
import { config } from '../config/config.js';
import { apiGet, apiPost, apiPatch, apiDelete } from './api.js';

const CART_KEY = 'cart';

// In-memory cache for API mode: [{ itemUid, productId, name, price, qty, image }]
let _cartCache = null;

function normalizeApiItem(item, product) {
  return {
    itemUid: item.uid,
    productId: item.product_uid,
    name: product.name,
    price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
    qty: item.quantity,
    image: product.image || null,
  };
}

// ── Mock implementations ─────────────────────────────────────────────────────

function mockGetCart() {
  return lsGetAll(CART_KEY);
}

function mockAddToCart(product, qty = 1) {
  const cart = mockGetCart();
  const existing = cart.find(item => item.productId === String(product.id));
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      productId: String(product.id),
      name: product.name,
      price: product.price,
      qty,
      image: product.image || null,
    });
  }
  lsSet(CART_KEY, cart);
  eventBus.emit('cart:updated', cart);
}

function mockRemoveFromCart(productId) {
  const cart = mockGetCart().filter(item => item.productId !== String(productId));
  lsSet(CART_KEY, cart);
  eventBus.emit('cart:updated', cart);
}

function mockUpdateQty(productId, qty) {
  const cart = mockGetCart();
  const item = cart.find(i => i.productId === String(productId));
  if (item) {
    if (qty <= 0) {
      mockRemoveFromCart(productId);
      return;
    }
    item.qty = qty;
    lsSet(CART_KEY, cart);
    eventBus.emit('cart:updated', cart);
  }
}

function mockClearCart() {
  lsSet(CART_KEY, []);
  eventBus.emit('cart:updated', []);
}

// ── Real API implementations ─────────────────────────────────────────────────

async function apiGetCart() {
  const data = await apiGet('/cart/me');
  const normalized = await Promise.all(
    data.items.map(async item => {
      const product = await apiGet(`/products/${item.product_uid}`);
      return normalizeApiItem(item, product);
    })
  );
  _cartCache = normalized;
  return normalized;
}

async function apiAddToCart(product, qty = 1) {
  const item = await apiPost('/cart/items', { product_uid: product.id, quantity: qty });
  if (_cartCache !== null) {
    const existing = _cartCache.find(i => i.productId === item.product_uid);
    if (existing) {
      existing.qty = item.quantity;
      existing.itemUid = item.uid;
    } else {
      _cartCache.push(normalizeApiItem(item, product));
    }
  }
  eventBus.emit('cart:updated', _cartCache);
}

async function apiRemoveFromCart(productId) {
  if (_cartCache === null) return;
  const cached = _cartCache.find(i => i.productId === String(productId));
  if (!cached) return;
  await apiDelete(`/cart/items/${cached.itemUid}`);
  _cartCache = _cartCache.filter(i => i.productId !== String(productId));
  eventBus.emit('cart:updated', _cartCache);
}

async function apiUpdateQty(productId, qty) {
  if (_cartCache === null) return;
  const cached = _cartCache.find(i => i.productId === String(productId));
  if (!cached) return;
  if (qty <= 0) {
    await apiRemoveFromCart(productId);
    return;
  }
  await apiPatch(`/cart/items/${cached.itemUid}`, { quantity: qty });
  cached.qty = qty;
  eventBus.emit('cart:updated', _cartCache);
}

async function apiClearCart() {
  await apiDelete('/cart/clear');
  _cartCache = [];
  eventBus.emit('cart:updated', []);
}

// ── Public API ───────────────────────────────────────────────────────────────

export async function getCart() {
  return config.USE_MOCK ? mockGetCart() : apiGetCart();
}

export async function addToCart(product, qty = 1) {
  return config.USE_MOCK ? mockAddToCart(product, qty) : apiAddToCart(product, qty);
}

export async function removeFromCart(productId) {
  return config.USE_MOCK ? mockRemoveFromCart(productId) : apiRemoveFromCart(productId);
}

export async function updateQty(productId, qty) {
  return config.USE_MOCK ? mockUpdateQty(productId, qty) : apiUpdateQty(productId, qty);
}

export async function clearCart() {
  return config.USE_MOCK ? mockClearCart() : apiClearCart();
}

export function getTotal() {
  const items = config.USE_MOCK ? lsGetAll(CART_KEY) : (_cartCache || []);
  return items.reduce((sum, item) => sum + item.price * item.qty, 0);
}

export function getCount() {
  const items = config.USE_MOCK ? lsGetAll(CART_KEY) : (_cartCache || []);
  return items.reduce((sum, item) => sum + item.qty, 0);
}
