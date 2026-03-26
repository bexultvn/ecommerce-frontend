import { isInWishlist } from '../services/wishlistService.js';

const STARS = `<div class="flex items-center gap-0.5">
  ${[1,2,3,4].map(() => `<svg class="w-3 h-3 text-amber-400" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>`).join('')}
  <svg class="w-3 h-3 text-amber-400 opacity-40" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
  <span class="text-[11px] text-gray-400 ml-0.5">(88)</span>
</div>`;

export function productCard(product) {
  const wishlisted = isInWishlist(product.id);

  const imageHTML = product.image
    ? `<img src="${product.image}" alt="${product.name}" class="w-full h-48 object-contain bg-gray-50 p-4 transition-transform duration-500 group-hover:scale-105" />`
    : `<div class="w-full h-48 bg-gray-50 flex items-center justify-center text-gray-300">
         <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
       </div>`;

  return `
    <div class="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 hover:border-gray-200 transition-all duration-200 cursor-pointer">

      <!-- Image Area -->
      <div class="relative overflow-hidden bg-gray-50">
        <a href="#/product/${product.id}" class="block">
          ${imageHTML}
        </a>

        <!-- Wishlist -->
        <button
          class="absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm
            ${wishlisted
              ? 'bg-white text-red-500'
              : 'bg-white text-gray-300 sm:opacity-0 sm:group-hover:opacity-100 hover:text-red-400'}"
          data-action="toggle-wishlist"
          data-product-id="${product.id}"
          aria-label="${wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}"
        >
          <svg class="w-4 h-4" fill="${wishlisted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
          </svg>
        </button>

        <!-- Add to cart overlay -->
        <button
          class="absolute bottom-0 left-0 right-0 bg-gray-900 text-white text-xs py-2.5 font-semibold sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-1.5"
          data-action="add-to-cart"
          data-product-id="${product.id}"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" pointer-events="none"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
          Add To Cart
        </button>
      </div>

      <!-- Info -->
      <div class="p-3.5">
        <a href="#/product/${product.id}" class="block">
          <h3 class="text-sm font-semibold text-gray-800 hover:text-red-500 transition-colors mb-2 line-clamp-2 leading-snug">${product.name}</h3>
        </a>
        ${STARS}
        <div class="mt-2">
          <span class="text-red-500 font-bold text-base">$${Number(product.price).toFixed(2)}</span>
        </div>
      </div>
    </div>
  `;
}
