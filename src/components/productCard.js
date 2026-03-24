import { isInWishlist } from '../services/wishlistService.js';

export function productCard(product) {
  const wishlisted = isInWishlist(product.id);

  const imageHTML = product.image
    ? `<img src="${product.image}" alt="${product.name}" class="w-full h-48 object-contain bg-gray-100 p-4 transition-transform duration-300 group-hover:scale-105" />`
    : `<div class="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">No image</div>`;

  return `
    <div class="group relative cursor-pointer">
      <div class="relative overflow-hidden rounded bg-gray-100 mb-3">
        <a href="#/product/${product.id}" class="block">
          ${imageHTML}
        </a>

        <!-- Wishlist button -->
        <button
          class="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm
            ${wishlisted
              ? 'bg-white text-red-500'
              : 'bg-white text-gray-300 opacity-0 group-hover:opacity-100 hover:text-red-400'}"
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
          class="absolute bottom-0 left-0 right-0 bg-black text-white text-sm py-2.5 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          data-action="add-to-cart"
          data-product-id="${product.id}"
        >
          Add To Cart
        </button>
      </div>
      <a href="#/product/${product.id}" class="block">
        <h3 class="font-semibold text-sm text-gray-900 hover:text-gray-600 mb-1 line-clamp-2">${product.name}</h3>
      </a>
      <div class="flex items-center gap-2 mb-1">
        <span class="text-red-500 font-bold text-base">$${Number(product.price).toFixed(2)}</span>
      </div>
    </div>
  `;
}
