import { getById } from '../services/productService.js';
import { addToCart } from '../services/cartService.js';
import { toggleWishlist, isInWishlist } from '../services/wishlistService.js';
import { showToast } from '../components/toast.js';
import { isLoggedIn } from '../core/auth.js';
import { navigate } from '../core/router.js';

export const template = `
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-sm text-gray-400 mb-10">
        <a href="#/" class="hover:text-gray-700 transition-colors">Home</a>
        <svg class="w-3.5 h-3.5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        <a href="#/products" class="hover:text-gray-700 transition-colors">Products</a>
        <svg class="w-3.5 h-3.5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        <span id="bc-category" class="hover:text-gray-700 transition-colors cursor-default"></span>
        <svg class="w-3.5 h-3.5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        <span id="bc-name" class="text-gray-700 font-medium truncate max-w-xs"></span>
      </nav>
      <div id="product-content" class="flex items-center justify-center py-24">
        <div class="flex flex-col items-center gap-3 text-gray-400">
          <svg class="w-8 h-8 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
          <p class="text-sm">Loading product...</p>
        </div>
      </div>
    </div>
  </div>
`;

export async function init(params = {}) {
  const productId = params.id;
  const content = document.getElementById('product-content');

  const product = productId ? await getById(productId) : null;

  if (!product) {
    content.innerHTML = `
      <div class="text-center py-24">
        <div class="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-5">
          <svg class="w-9 h-9 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </div>
        <h2 class="text-xl font-semibold text-gray-700 mb-2">Product not found</h2>
        <p class="text-gray-400 text-sm mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <a href="#/products" class="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-medium transition-colors text-sm">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          Back to Products
        </a>
      </div>`;
    return;
  }

  const bcCat = document.getElementById('bc-category');
  const bcName = document.getElementById('bc-name');
  if (bcCat) bcCat.textContent = product.categoryName || 'Product';
  if (bcName) bcName.textContent = product.name;

  const qty = product.availableQuantity;
  const inStock = qty > 0;

  const mainImage = product.image
    ? `<img src="${product.image}" alt="${product.name}" class="w-full h-full object-contain p-8 transition-transform duration-500 hover:scale-105" />`
    : `<div class="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-3">
         <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
         <span class="text-sm">No image available</span>
       </div>`;

  const stockDisplay = inStock
    ? `<span class="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600">
         <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block"></span>
         In Stock
       </span>`
    : `<span class="inline-flex items-center gap-1.5 text-sm font-medium text-red-500">
         <span class="w-2 h-2 rounded-full bg-red-400 inline-block"></span>
         Out of Stock
       </span>`;

  const starsHTML = `
    <div class="flex items-center gap-0.5">
      ${[1,2,3,4].map(() => `<svg class="w-4 h-4 text-amber-400" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>`).join('')}
      <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><defs><linearGradient id="half"><stop offset="50%" stop-color="#fbbf24"/><stop offset="50%" stop-color="#d1d5db"/></linearGradient></defs><path fill="url(#half)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
    </div>`;

  content.innerHTML = `
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 items-start">

      <!-- ── LEFT: Image Panel ── -->
      <div class="space-y-4">
        <!-- Main image -->
        <div class="relative bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" style="aspect-ratio:1/1; max-height:520px;">
          ${mainImage}
          <!-- Stock overlay badge -->
          <div class="absolute top-4 left-4">
            ${inStock
              ? `<span class="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-emerald-100">
                   <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block"></span> In Stock
                 </span>`
              : `<span class="bg-red-50 text-red-600 text-xs font-semibold px-3 py-1.5 rounded-full border border-red-100">Out of Stock</span>`
            }
          </div>
        </div>

        <!-- Trust strip -->
        <div class="grid grid-cols-3 gap-3">
          <div class="flex flex-col items-center gap-2 bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
            <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/></svg>
            <p class="text-xs font-medium text-gray-700">Free Shipping</p>
            <p class="text-xs text-gray-400">Over $140</p>
          </div>
          <div class="flex flex-col items-center gap-2 bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
            <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            <p class="text-xs font-medium text-gray-700">30-Day Returns</p>
            <p class="text-xs text-gray-400">Hassle free</p>
          </div>
          <div class="flex flex-col items-center gap-2 bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
            <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
            <p class="text-xs font-medium text-gray-700">Secure Payment</p>
            <p class="text-xs text-gray-400">100% protected</p>
          </div>
        </div>
      </div>

      <!-- ── RIGHT: Product Info ── -->
      <div class="space-y-6">

        <!-- Category tag -->
        <span class="inline-block text-xs font-bold uppercase tracking-widest text-red-500 bg-red-50 px-3 py-1.5 rounded-full border border-red-100">
          ${product.categoryName || 'Product'}
        </span>

        <!-- Name -->
        <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">${product.name}</h1>

        <!-- Rating + stock -->
        <div class="flex items-center gap-3 flex-wrap">
          ${starsHTML}
          <span class="text-sm text-gray-400">(4.5 / 5)</span>
          <div class="w-px h-4 bg-gray-200"></div>
          ${stockDisplay}
          ${inStock ? `<div class="w-px h-4 bg-gray-200"></div><span class="text-xs text-gray-400">${qty} units left</span>` : ''}
        </div>

        <!-- Price -->
        <div class="flex items-baseline gap-3">
          <span class="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900">$${Number(product.price).toFixed(2)}</span>
        </div>

        <hr class="border-gray-100"/>

        <!-- Description -->
        <div>
          <p class="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">Description</p>
          <p class="text-gray-600 leading-relaxed text-sm">${product.description}</p>
        </div>

        <!-- Quantity + Actions -->
        ${inStock ? `
        <div class="space-y-3">
          <p class="text-sm font-medium text-gray-700">Quantity</p>
          <div class="flex items-center gap-3">
            <!-- Qty selector -->
            <div class="inline-flex items-center border-2 border-gray-200 rounded-xl overflow-hidden bg-white">
              <button id="qty-dec"
                class="w-11 h-11 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors text-xl select-none"
                aria-label="Decrease quantity">−</button>
              <input type="number" id="qty-input" value="1" min="1" max="${qty}"
                class="w-14 h-11 text-center font-semibold text-sm outline-none bg-transparent" />
              <button id="qty-inc"
                class="w-11 h-11 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors text-xl select-none"
                aria-label="Increase quantity">+</button>
            </div>

            <!-- Add to Cart -->
            <button id="add-to-cart-btn"
              class="group flex-1 h-11 rounded-xl font-semibold text-sm text-white transition-all duration-200 flex items-center justify-center gap-2 hover:-translate-y-0.5"
              style="background:linear-gradient(135deg,#ef4444,#dc2626);box-shadow:0 4px 20px rgba(239,68,68,0.35);">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
              Add to Cart
            </button>

            <!-- Wishlist -->
            <button id="wishlist-btn"
              class="w-11 h-11 rounded-xl border-2 flex items-center justify-center transition-all duration-200 ${isInWishlist(product.id) ? 'border-red-300 bg-red-50 text-red-500' : 'border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-400 hover:bg-red-50'}"
              aria-label="Toggle wishlist"
              title="${isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}">
              <svg class="w-5 h-5" fill="${isInWishlist(product.id) ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
            </button>
          </div>
        </div>
        ` : `
        <div class="space-y-3">
          <button disabled class="w-full h-11 bg-gray-100 text-gray-400 rounded-xl font-semibold text-sm cursor-not-allowed">
            Out of Stock
          </button>
          <p class="text-xs text-gray-400 text-center">This item is currently unavailable. Check back later.</p>
        </div>
        `}

        <!-- Product metadata -->
        <div class="bg-gray-50 rounded-xl p-4 space-y-2.5 text-sm border border-gray-100">
          <div class="flex gap-3">
            <span class="text-gray-400 w-24 flex-shrink-0">Category</span>
            <span class="text-gray-700 font-medium">${product.categoryName || '—'}</span>
          </div>
          <div class="flex gap-3">
            <span class="text-gray-400 w-24 flex-shrink-0">SKU</span>
            <span class="text-gray-700 font-medium font-mono">#${String(product.id).padStart(6, '0')}</span>
          </div>
          <div class="flex gap-3">
            <span class="text-gray-400 w-24 flex-shrink-0">Availability</span>
            ${inStock
              ? `<span class="text-emerald-600 font-medium">${qty} in stock</span>`
              : `<span class="text-red-500 font-medium">Unavailable</span>`}
          </div>
        </div>

      </div>
    </div>
  `;

  if (inStock) {
    const qtyInput = document.getElementById('qty-input');

    document.getElementById('qty-dec').addEventListener('click', () => {
      const v = parseInt(qtyInput.value, 10);
      if (v > 1) qtyInput.value = v - 1;
    });

    document.getElementById('qty-inc').addEventListener('click', () => {
      const v = parseInt(qtyInput.value, 10);
      if (v < qty) qtyInput.value = v + 1;
    });

    document.getElementById('add-to-cart-btn').addEventListener('click', () => {
      if (!isLoggedIn()) { showToast('Please sign in to add items to cart', 'error'); navigate('/login'); return; }
      const q = parseInt(qtyInput.value, 10);
      if (isNaN(q) || q < 1) { showToast('Please enter a valid quantity', 'error'); return; }
      addToCart(product, q);
      showToast(`${product.name} added to cart!`, 'success');
    });

    document.getElementById('wishlist-btn').addEventListener('click', (e) => {
      if (!isLoggedIn()) { showToast('Please sign in to save items to wishlist', 'error'); navigate('/login'); return; }
      const btn = e.currentTarget;
      const added = toggleWishlist(product);
      btn.classList.toggle('text-red-500', added);
      btn.classList.toggle('border-red-300', added);
      btn.classList.toggle('bg-red-50', added);
      btn.classList.toggle('text-gray-400', !added);
      btn.classList.toggle('border-gray-200', !added);
      btn.querySelector('svg').setAttribute('fill', added ? 'currentColor' : 'none');
      btn.setAttribute('title', added ? 'Remove from wishlist' : 'Add to wishlist');
      showToast(added ? 'Added to wishlist!' : 'Removed from wishlist', added ? 'success' : 'info');
    });
  }
}
