import { lsGetAll, lsSet } from '../storage/localStorage.js';
import { eventBus } from '../core/eventBus.js';

const CART_KEY = 'cart';

export function getCart() {
  return lsGetAll(CART_KEY);
}

export function addToCart(product, qty = 1) {
  const cart = getCart();
  const existing = cart.find(item => item.productId === String(product.id));

  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      productId: String(product.id),
      name: product.name,
      price: product.price,
      qty,
      image: product.image || null
    });
  }

  lsSet(CART_KEY, cart);
  eventBus.emit('cart:updated', cart);
}

export function removeFromCart(productId) {
  const cart = getCart().filter(item => item.productId !== String(productId));
  lsSet(CART_KEY, cart);
  eventBus.emit('cart:updated', cart);
}

export function updateQty(productId, qty) {
  const cart = getCart();
  const item = cart.find(i => i.productId === String(productId));
  if (item) {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    item.qty = qty;
    lsSet(CART_KEY, cart);
    eventBus.emit('cart:updated', cart);
  }
}

export function clearCart() {
  lsSet(CART_KEY, []);
  eventBus.emit('cart:updated', []);
}

export function getTotal() {
  return getCart().reduce((sum, item) => sum + item.price * item.qty, 0);
}

export function getCount() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}
