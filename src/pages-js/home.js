import { getAll } from '../services/productService.js';
import { addToCart } from '../services/cartService.js';
import { productCard } from '../components/productCard.js';
import { showToast } from '../components/toast.js';
import { navigate } from '../core/router.js';

export const template = `
  <div>
    <!-- Flash Sales -->
    <section class="max-w-7xl mx-auto px-6 py-10">
      <div class="flex items-center gap-3 mb-6">
        <span class="w-5 h-10 bg-red-500 rounded-sm inline-block"></span>
        <span class="text-red-500 font-semibold text-sm">Today's</span>
      </div>
      <div class="flex items-center justify-between mb-8 flex-wrap gap-4">
        <h2 class="text-3xl font-semibold">Flash Sales</h2>
      </div>
      <div id="flash-grid" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        <div class="col-span-5 text-center text-gray-400 py-8">Loading...</div>
      </div>
      <div class="text-center mt-10">
        <a href="#/products" class="inline-block border border-gray-300 px-14 py-3 rounded text-sm font-medium hover:bg-gray-50 transition-colors">View All Products</a>
      </div>
    </section>

    <hr class="max-w-7xl mx-auto px-6 border-gray-200" />

    <!-- Browse By Category -->
    <section class="max-w-7xl mx-auto px-6 py-10">
      <div class="flex items-center gap-3 mb-6">
        <span class="w-5 h-10 bg-red-500 rounded-sm inline-block"></span>
        <span class="text-red-500 font-semibold text-sm">Categories</span>
      </div>
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-3xl font-semibold">Browse By Category</h2>
      </div>
      <div class="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4">
        <button class="category-btn border border-gray-200 rounded p-5 flex flex-col items-center gap-2 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all group" data-category="Electronics">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
          <span class="text-xs font-medium">Phones</span>
        </button>
        <button class="category-btn border border-gray-200 rounded p-5 flex flex-col items-center gap-2 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all group" data-category="Electronics">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
          <span class="text-xs font-medium">Computers</span>
        </button>
        <button class="category-btn border border-gray-200 rounded p-5 flex flex-col items-center gap-2 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all group" data-category="Electronics">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <span class="text-xs font-medium">SmartWatch</span>
        </button>
        <button class="category-btn border border-gray-200 rounded p-5 flex flex-col items-center gap-2 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all group" data-category="Electronics">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          <span class="text-xs font-medium">Camera</span>
        </button>
        <button class="category-btn border border-gray-200 rounded p-5 flex flex-col items-center gap-2 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all group" data-category="Electronics">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/></svg>
          <span class="text-xs font-medium">HeadPhones</span>
        </button>
        <button class="category-btn border border-gray-200 rounded p-5 flex flex-col items-center gap-2 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all group" data-category="Electronics">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"/></svg>
          <span class="text-xs font-medium">Gaming</span>
        </button>
      </div>
    </section>

    <hr class="max-w-7xl mx-auto px-6 border-gray-200" />

    <!-- Best Selling Products -->
    <section class="max-w-7xl mx-auto px-6 py-10">
      <div class="flex items-center gap-3 mb-6">
        <span class="w-5 h-10 bg-red-500 rounded-sm inline-block"></span>
        <span class="text-red-500 font-semibold text-sm">This Month</span>
      </div>
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-3xl font-semibold">Best Selling Products</h2>
        <a href="#/products" class="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded text-sm font-medium transition-colors">View All</a>
      </div>
      <div id="best-grid" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        <div class="col-span-4 text-center text-gray-400 py-8">Loading...</div>
      </div>
    </section>

    <!-- Explore Our Products -->
    <section class="max-w-7xl mx-auto px-6 py-10">
      <div class="flex items-center gap-3 mb-6">
        <span class="w-5 h-10 bg-red-500 rounded-sm inline-block"></span>
        <span class="text-red-500 font-semibold text-sm">Our Products</span>
      </div>
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-3xl font-semibold">Explore Our Products</h2>
      </div>
      <div id="explore-grid" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        <div class="col-span-4 text-center text-gray-400 py-8">Loading...</div>
      </div>
      <div class="text-center mt-10">
        <a href="#/products" class="inline-block border border-gray-300 px-14 py-3 rounded text-sm font-medium hover:bg-gray-50 transition-colors">View All Products</a>
      </div>
    </section>

    <!-- Service Badges -->
    <section class="max-w-7xl mx-auto px-6 py-12 border-t border-gray-200">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
        <div class="flex flex-col items-center gap-3">
          <div class="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
            <div class="w-10 h-10 rounded-full bg-black flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/></svg>
            </div>
          </div>
          <div>
            <p class="font-semibold text-sm">FREE AND FAST DELIVERY</p>
            <p class="text-xs text-gray-500 mt-1">Free delivery for all orders over $140</p>
          </div>
        </div>
        <div class="flex flex-col items-center gap-3">
          <div class="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
            <div class="w-10 h-10 rounded-full bg-black flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
            </div>
          </div>
          <div>
            <p class="font-semibold text-sm">24/7 CUSTOMER SERVICE</p>
            <p class="text-xs text-gray-500 mt-1">Friendly 24/7 customer support</p>
          </div>
        </div>
        <div class="flex flex-col items-center gap-3">
          <div class="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
            <div class="w-10 h-10 rounded-full bg-black flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
            </div>
          </div>
          <div>
            <p class="font-semibold text-sm">MONEY BACK GUARANTEE</p>
            <p class="text-xs text-gray-500 mt-1">We return money within 30 days</p>
          </div>
        </div>
      </div>
    </section>
  </div>
`;

export async function init() {
  let allProducts = [];
  try {
    allProducts = await getAll();
  } catch (e) {
    const flashGrid = document.getElementById('flash-grid');
    if (flashGrid) flashGrid.innerHTML = '<div class="col-span-5 text-center text-gray-400 py-8">Failed to load products.</div>';
    return;
  }

  const flashGrid = document.getElementById('flash-grid');
  const bestGrid = document.getElementById('best-grid');
  const exploreGrid = document.getElementById('explore-grid');

  const flashProducts = allProducts.slice(0, 5);
  const bestProducts = allProducts.slice(0, 4);
  const exploreProducts = allProducts.slice(0, 8);

  if (flashGrid) flashGrid.innerHTML = flashProducts.length ? flashProducts.map(p => productCard(p)).join('') : '<div class="col-span-5 text-center text-gray-400 py-8">No products.</div>';
  if (bestGrid) bestGrid.innerHTML = bestProducts.length ? bestProducts.map(p => productCard(p)).join('') : '<div class="col-span-4 text-center text-gray-400 py-8">No products.</div>';
  if (exploreGrid) exploreGrid.innerHTML = exploreProducts.length ? exploreProducts.map(p => productCard(p)).join('') : '<div class="col-span-4 text-center text-gray-400 py-8">No products.</div>';

  // Category buttons
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-category');
      navigate(`/products?category=${encodeURIComponent(category)}`);
    });
  });

  // Add to cart via event delegation on all grids
  [flashGrid, bestGrid, exploreGrid].forEach(grid => {
    if (!grid) return;
    grid.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action="add-to-cart"]');
      if (!btn) return;
      const productId = btn.getAttribute('data-product-id');
      const product = allProducts.find(p => String(p.id) === String(productId));
      if (product) {
        addToCart(product, 1);
        showToast(`${product.name} added to cart!`, 'success');
      }
    });
  });
}
