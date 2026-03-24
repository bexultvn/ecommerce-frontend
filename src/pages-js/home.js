import { getAll } from '../services/productService.js';
import { addToCart } from '../services/cartService.js';
import { toggleWishlist } from '../services/wishlistService.js';
import { productCard } from '../components/productCard.js';
import { showToast } from '../components/toast.js';
import { navigate } from '../core/router.js';

export const template = `
  <div>
    <!-- Hero Section -->
    <section class="relative bg-black text-white overflow-hidden" style="min-height:640px;">
      <!-- Background atmosphere -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute top-0 right-0 rounded-full opacity-25 blur-[120px]" style="width:520px;height:520px;background:radial-gradient(circle,#ef4444,#ec4899);transform:translate(30%,-30%);"></div>
        <div class="absolute bottom-0 left-0 rounded-full opacity-15 blur-[100px]" style="width:400px;height:400px;background:radial-gradient(circle,#6366f1,#8b5cf6);transform:translate(-30%,30%);"></div>
        <div class="absolute inset-0" style="background-image:linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px);background-size:64px 64px;"></div>
      </div>

      <div class="relative max-w-7xl mx-auto px-6 py-20 flex flex-col lg:flex-row items-center gap-16" style="min-height:640px;">

        <!-- LEFT: Text Content -->
        <div class="flex-1 space-y-8 z-10 text-center lg:text-left">

          <!-- Live badge -->
          <div class="inline-flex items-center gap-2 rounded-full px-4 py-1.5 border text-sm font-medium" style="background:rgba(239,68,68,0.08);border-color:rgba(239,68,68,0.25);color:#f87171;">
            <span class="w-2 h-2 rounded-full bg-red-400 animate-pulse inline-block"></span>
            New Collection &mdash; Spring 2026
          </div>

          <!-- Headline -->
          <h1 class="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight">
            Shop<br/>
            <span class="hero-gradient-text">Smarter.</span><br/>
            <span class="text-gray-400 font-light italic text-4xl md:text-5xl lg:text-6xl">Live Better.</span>
          </h1>

          <!-- Description -->
          <p class="text-gray-400 text-base md:text-lg max-w-sm leading-relaxed mx-auto lg:mx-0">
            Premium electronics, fashion &amp; more — curated for the modern lifestyle. Fast delivery, unbeatable prices.
          </p>

          <!-- CTA Buttons -->
          <div class="flex flex-wrap items-center gap-4 justify-center lg:justify-start">
            <a href="#/products"
               class="group inline-flex items-center gap-3 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
               style="background:linear-gradient(135deg,#ef4444,#dc2626);box-shadow:0 8px 32px rgba(239,68,68,0.4);">
              Explore Now
              <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </a>
            <a href="#/products" class="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm font-medium">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
              </svg>
              View Hot Deals
            </a>
          </div>

          <!-- Stats -->
          <div class="flex items-center gap-6 pt-6 border-t border-gray-800 justify-center lg:justify-start">
            <div class="text-center lg:text-left">
              <p class="text-2xl font-black">50K+</p>
              <p class="text-xs text-gray-500 mt-0.5">Happy Customers</p>
            </div>
            <div class="w-px h-10 bg-gray-800"></div>
            <div class="text-center lg:text-left">
              <p class="text-2xl font-black">500+</p>
              <p class="text-xs text-gray-500 mt-0.5">Products</p>
            </div>
            <div class="w-px h-10 bg-gray-800"></div>
            <div class="text-center lg:text-left">
              <p class="text-2xl font-black text-red-400">40%</p>
              <p class="text-xs text-gray-500 mt-0.5">Max Discount</p>
            </div>
          </div>
        </div>

        <!-- RIGHT: Floating Product Showcase -->
        <div class="flex-1 flex justify-center items-center relative" style="min-height:420px;">

          <!-- Spinning rings -->
          <div class="absolute rounded-full animate-spin-slow pointer-events-none" style="width:340px;height:340px;border:1px dashed rgba(239,68,68,0.25);"></div>
          <div class="absolute rounded-full pointer-events-none" style="width:260px;height:260px;border:1px solid rgba(239,68,68,0.1);animation:spin-slow 18s linear infinite reverse;"></div>

          <!-- Glow behind center -->
          <div class="absolute rounded-full pointer-events-none" style="width:160px;height:160px;background:radial-gradient(circle,rgba(239,68,68,0.3),transparent);filter:blur(30px);"></div>

          <!-- Center card: Smartphones -->
          <div class="relative z-10 text-center rounded-2xl p-6 w-44 shadow-2xl border" style="background:#111827;border-color:rgba(239,68,68,0.3);box-shadow:0 0 50px rgba(239,68,68,0.2);">
            <div class="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3" style="background:rgba(239,68,68,0.1);">
              <svg class="w-9 h-9 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>
              </svg>
            </div>
            <p class="text-white font-bold text-sm">Smartphones</p>
            <p class="text-gray-500 text-xs mt-1">120+ items</p>
            <div class="mt-3 w-full h-px" style="background:linear-gradient(90deg,transparent,#ef4444,transparent);"></div>
          </div>

          <!-- Floating: top-right — Laptops -->
          <div class="absolute z-10 rounded-xl p-3.5 w-32 shadow-xl border animate-float" style="top:10px;right:10px;background:#111827;border-color:rgba(59,130,246,0.2);">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style="background:rgba(59,130,246,0.1);">
              <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </div>
            <p class="text-white text-xs font-semibold">Laptops</p>
            <p class="text-gray-500 text-xs">85 items</p>
          </div>

          <!-- Floating: bottom-right — Gaming -->
          <div class="absolute z-10 rounded-xl p-3.5 w-32 shadow-xl border animate-float-delay" style="bottom:20px;right:0;background:#111827;border-color:rgba(236,72,153,0.2);">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style="background:rgba(236,72,153,0.1);">
              <svg class="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"/>
              </svg>
            </div>
            <p class="text-white text-xs font-semibold">Gaming</p>
            <p class="text-gray-500 text-xs">64 items</p>
          </div>

          <!-- Floating: top-left — Audio -->
          <div class="absolute z-10 rounded-xl p-3.5 w-32 shadow-xl border animate-float-reverse" style="top:20px;left:0;background:#111827;border-color:rgba(139,92,246,0.2);">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style="background:rgba(139,92,246,0.1);">
              <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
              </svg>
            </div>
            <p class="text-white text-xs font-semibold">Audio</p>
            <p class="text-gray-500 text-xs">97 items</p>
          </div>

          <!-- Floating: bottom-left — Watches -->
          <div class="absolute z-10 rounded-xl p-3.5 w-32 shadow-xl border animate-float-slow" style="bottom:10px;left:10px;background:#111827;border-color:rgba(34,197,94,0.2);">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style="background:rgba(34,197,94,0.1);">
              <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <p class="text-white text-xs font-semibold">Watches</p>
            <p class="text-gray-500 text-xs">42 items</p>
          </div>

        </div>
      </div>
    </section>


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

  // Event delegation: cart + wishlist on all grids
  [flashGrid, bestGrid, exploreGrid].forEach(grid => {
    if (!grid) return;
    grid.addEventListener('click', (e) => {
      const cartBtn = e.target.closest('[data-action="add-to-cart"]');
      if (cartBtn) {
        const product = allProducts.find(p => String(p.id) === String(cartBtn.getAttribute('data-product-id')));
        if (product) { addToCart(product, 1); showToast(`${product.name} added to cart!`, 'success'); }
        return;
      }

      const wishBtn = e.target.closest('[data-action="toggle-wishlist"]');
      if (wishBtn) {
        const product = allProducts.find(p => String(p.id) === String(wishBtn.getAttribute('data-product-id')));
        if (!product) return;
        const added = toggleWishlist(product);
        const svg = wishBtn.querySelector('svg');
        svg.setAttribute('fill', added ? 'currentColor' : 'none');
        wishBtn.classList.toggle('text-red-500', added);
        wishBtn.classList.toggle('text-gray-300', !added);
        wishBtn.classList.toggle('opacity-100', added);
        wishBtn.setAttribute('aria-label', added ? 'Remove from wishlist' : 'Add to wishlist');
        showToast(added ? `${product.name} added to wishlist!` : 'Removed from wishlist', added ? 'success' : 'info');
        return;
      }
    });
  });
}
