import { lsGetAll, lsSet } from '../storage/localStorage.js';
import { eventBus } from '../core/eventBus.js';

const WISHLIST_KEY = 'wishlist';

export function getWishlist() {
  return lsGetAll(WISHLIST_KEY);
}

export function isInWishlist(productId) {
  return getWishlist().some(item => item.productId === String(productId));
}

export function addToWishlist(product) {
  if (isInWishlist(product.id)) return;
  const list = getWishlist();
  list.push({
    productId: String(product.id),
    name: product.name,
    price: product.price,
    image: product.image || null,
    categoryName: product.categoryName || null,
  });
  lsSet(WISHLIST_KEY, list);
  eventBus.emit('wishlist:updated', list);
}

export function removeFromWishlist(productId) {
  const list = getWishlist().filter(item => item.productId !== String(productId));
  lsSet(WISHLIST_KEY, list);
  eventBus.emit('wishlist:updated', list);
}

export function toggleWishlist(product) {
  if (isInWishlist(product.id)) {
    removeFromWishlist(product.id);
    return false; // removed
  } else {
    addToWishlist(product);
    return true; // added
  }
}

export function getCount() {
  return getWishlist().length;
}
