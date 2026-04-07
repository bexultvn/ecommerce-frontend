import { lsGetAll, lsSet } from '../storage/localStorage.js';
import { eventBus } from '../core/eventBus.js';
import { config } from '../config/config.js';
import { apiGet, apiPost, apiPatch, apiDelete } from './api.js';

const CART_KEY = 'cart';

// cache for real API mode
let _cartCache = null;

function normalizeApiItem(item, product = null) {
  return {
    itemUid: String(item.uid),
    productId: String(item.product_uid),
    name: product?.name ?? 'Unknown product',
    price: product
      ? (typeof product.price === 'string' ? parseFloat(product.price) : product.price)
      : 0,
    qty: item.quantity,
    image: product?.image || null,
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

async function fetchProductById(productId) {
  try {
    return await apiGet(config.API.product, `/products/${productId}`);
  } catch (error) {
    console.error(`Failed to fetch product ${productId}:`, error);
    return null;
  }
}

async function apiGetCart() {
  const data = await apiGet(config.API.cart, '/cart/me');

  const normalized = await Promise.all(
    data.items.map(async (item) => {
      const product = await fetchProductById(item.product_uid);
      return normalizeApiItem(item, product);
    })
  );

  _cartCache = normalized;
  return normalized;
}

async function apiAddToCart(product, qty = 1) {
  const createdItem = await apiPost(config.API.cart, '/cart/items', {
    product_uid: product.id,
    quantity: qty,
  });

  const normalizedItem = normalizeApiItem(createdItem, product);

  if (_cartCache === null) {
    _cartCache = await apiGetCart();
  } else {
    const existing = _cartCache.find(
      i => String(i.productId) === String(createdItem.product_uid)
    );

    if (existing) {
      existing.qty = createdItem.quantity;
      existing.itemUid = String(createdItem.uid);
    } else {
      _cartCache.push(normalizedItem);
    }
  }

  eventBus.emit('cart:updated', _cartCache);
  return normalizedItem;
}

async function apiRemoveFromCart(productId) {
  if (_cartCache === null) {
    await apiGetCart();
  }

  const cached = _cartCache.find(i => String(i.productId) === String(productId));
  if (!cached) return;

  await apiDelete(config.API.cart, `/cart/items/${cached.itemUid}`);

  _cartCache = _cartCache.filter(i => String(i.productId) !== String(productId));
  eventBus.emit('cart:updated', _cartCache);
}

async function apiUpdateQty(productId, qty) {
  if (_cartCache === null) {
    await apiGetCart();
  }

  const cached = _cartCache.find(i => String(i.productId) === String(productId));
  if (!cached) return;

  if (qty <= 0) {
    await apiRemoveFromCart(productId);
    return;
  }

  const updatedItem = await apiPatch(config.API.cart, `/cart/items/${cached.itemUid}`, {
    quantity: qty,
  });

  cached.qty = updatedItem.quantity;
  cached.itemUid = String(updatedItem.uid);

  eventBus.emit('cart:updated', _cartCache);
  return cached;
}

async function apiClearCart() {
  await apiDelete(config.API.cart, '/cart/clear');
  _cartCache = [];
  eventBus.emit('cart:updated', []);
}

// ── Public API ───────────────────────────────────────────────────────────────

export async function getCart() {
  return config.MOCK.cart ? mockGetCart() : apiGetCart();
}

export async function addToCart(product, qty = 1) {
  return config.MOCK.cart ? mockAddToCart(product, qty) : apiAddToCart(product, qty);
}

export async function removeFromCart(productId) {
  return config.MOCK.cart
    ? mockRemoveFromCart(productId)
    : apiRemoveFromCart(productId);
}

export async function updateQty(productId, qty) {
  return config.MOCK.cart
    ? mockUpdateQty(productId, qty)
    : apiUpdateQty(productId, qty);
}

export async function clearCart() {
  return config.MOCK.cart ? mockClearCart() : apiClearCart();
}

export function getTotal() {
  const items = config.MOCK.cart ? lsGetAll(CART_KEY) : (_cartCache || []);
  return items.reduce((sum, item) => sum + item.price * item.qty, 0);
}

export function getCount() {
  const items = config.MOCK.cart ? lsGetAll(CART_KEY) : (_cartCache || []);
  return items.reduce((sum, item) => sum + item.qty, 0);
}