import { getWishlist, removeFromWishlist } from '../services/wishlistService.js';
import { addToCart } from '../services/cartService.js';
import { showToast } from '../components/toast.js';
import { eventBus } from '../core/eventBus.js';

export const template = `
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-6 py-10">

      <!-- Page Header -->
      <div class="flex items-center justify-between mb-10">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">My Wishlist</h1>
          <p id="wishlist-subtitle" class="text-gray-400 text-sm mt-1"></p>
        </div>
        <a href="#/products"
           class="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          Continue Shopping
        </a>
      </div>

      <div id="wishlist-content"></div>
    </div>
  </div>
`;

function renderWishlist() {
  const items = getWishlist();
  const content = document.getElementById('wishlist-content');
  const subtitle = document.getElementById('wishlist-subtitle');
  if (!content) return;

  if (subtitle) {
    subtitle.textContent = items.length === 0
      ? 'Your wishlist is empty'
      : `${items.length} item${items.length > 1 ? 's' : ''} saved`;
  }

  if (items.length === 0) {
    content.innerHTML = `
      <div class="flex flex-col items-center justify-center py-28 text-center">
        <div class="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center mb-6">
          <svg class="w-12 h-12 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-gray-700 mb-2">Nothing saved yet</h2>
        <p class="text-gray-400 text-sm mb-8 max-w-xs">
          Tap the heart icon on any product to save it here for later.
        </p>
        <a href="#/products"
           class="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5"
           style="box-shadow:0 4px 20px rgba(239,68,68,0.3);">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
          </svg>
          Start Shopping
        </a>
      </div>`;
    return;
  }

  content.innerHTML = `
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      ${items.map(item => `
        <div class="wishlist-card group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
             data-id="${item.productId}">

          <!-- Image -->
          <a href="#/product/${item.productId}" class="block relative bg-gray-50 overflow-hidden" style="aspect-ratio:1/1;">
            ${item.image
              ? `<img src="${item.image}" alt="${item.name}"
                      class="w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-105"/>`
              : `<div class="w-full h-full flex items-center justify-center text-gray-300">
                   <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                       d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                   </svg>
                 </div>`
            }
            <!-- Remove button -->
            <button
              class="remove-btn absolute top-3 right-3 w-8 h-8 rounded-full bg-white border border-gray-100 shadow flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 transition-all duration-200 opacity-0 group-hover:opacity-100"
              data-id="${item.productId}"
              aria-label="Remove from wishlist"
              title="Remove">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </a>

          <!-- Info -->
          <div class="p-4 space-y-3">
            ${item.categoryName
              ? `<span class="text-xs font-semibold text-red-500 uppercase tracking-wider">${item.categoryName}</span>`
              : ''}
            <a href="#/product/${item.productId}"
               class="block text-sm font-semibold text-gray-800 hover:text-red-500 transition-colors leading-snug line-clamp-2">
              ${item.name}
            </a>
            <p class="text-lg font-black text-gray-900">$${Number(item.price).toFixed(2)}</p>

            <!-- Actions -->
            <div class="flex gap-2 pt-1">
              <button
                class="add-cart-btn flex-1 h-10 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 hover:-translate-y-0.5"
                style="box-shadow:0 2px 12px rgba(239,68,68,0.25);"
                data-id="${item.productId}"
                data-name="${item.name}"
                data-price="${item.price}"
                data-image="${item.image || ''}">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
                Add to Cart
              </button>
              <a href="#/product/${item.productId}"
                 class="w-10 h-10 rounded-xl border-2 border-gray-200 flex items-center justify-center text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-all duration-200 flex-shrink-0">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      `).join('')}
    </div>

    <!-- Clear all -->
    ${items.length > 1 ? `
    <div class="mt-8 flex justify-end">
      <button id="clear-wishlist"
        class="text-sm text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1.5">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
        </svg>
        Clear all
      </button>
    </div>
    ` : ''}
  `;

  // Remove buttons
  content.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.getAttribute('data-id');
      removeFromWishlist(id);
      showToast('Removed from wishlist', 'info');
    });
  });

  // Add to cart buttons
  content.querySelectorAll('.add-cart-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      addToCart({
        id: btn.getAttribute('data-id'),
        name: btn.getAttribute('data-name'),
        price: parseFloat(btn.getAttribute('data-price')),
        image: btn.getAttribute('data-image'),
      }, 1);
      showToast(`${btn.getAttribute('data-name')} added to cart!`, 'success');
    });
  });

  // Clear all
  document.getElementById('clear-wishlist')?.addEventListener('click', () => {
    getWishlist().forEach(item => removeFromWishlist(item.productId));
  });
}

export async function init() {
  renderWishlist();
  eventBus.on('wishlist:updated', renderWishlist);
}
