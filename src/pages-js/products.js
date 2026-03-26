import { getAll } from '../services/productService.js';
import { addToCart } from '../services/cartService.js';
import { toggleWishlist } from '../services/wishlistService.js';
import { productCard } from '../components/productCard.js';
import { showToast } from '../components/toast.js';
import { isLoggedIn } from '../core/auth.js';
import { navigate } from '../core/router.js';

export const template = `
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8">

      <!-- Page Header -->
      <div class="mb-8">
        <nav class="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
          <a href="#/" class="hover:text-gray-600 transition-colors">Home</a>
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          <span class="text-gray-700 font-medium">Products</span>
        </nav>
        <h1 class="text-2xl font-bold text-gray-900">All Products</h1>
      </div>

      <div class="flex gap-7">

        <!-- Mobile filter backdrop -->
        <div id="filter-backdrop" class="fixed inset-0 bg-black/50 z-40 hidden md:hidden"></div>

        <!-- Sidebar Filters -->
        <aside class="fixed inset-y-0 left-0 z-50 w-72 bg-white overflow-y-auto -translate-x-full transition-transform duration-300 md:sticky md:inset-auto md:w-52 md:translate-x-0 md:overflow-visible md:bg-transparent md:flex-shrink-0 md:self-start md:top-24">
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

            <!-- Filter Header -->
            <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <button id="close-filter-btn"
                class="md:hidden -ml-1 w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                aria-label="Close filters">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
              <span class="text-sm font-bold text-gray-900">Filters</span>
              <button id="clear-filters" class="text-xs text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                Clear
              </button>
            </div>

            <div class="px-5 py-4 space-y-5">
              <!-- Categories -->
              <div>
                <p class="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">Categories</p>
                <div class="space-y-2.5">
                  ${[['Electronics','Electronics'],['Clothing','Clothing'],['Books','Books'],['Home','Home']].map(([val, label]) => `
                  <label class="flex items-center gap-2.5 cursor-pointer group">
                    <input type="checkbox" class="category-filter accent-red-500 w-4 h-4 rounded cursor-pointer" value="${val}" />
                    <span class="text-sm text-gray-600 group-hover:text-gray-900 transition-colors select-none">${label}</span>
                  </label>`).join('')}
                </div>
              </div>

              <div class="border-t border-gray-100"></div>

              <!-- Price Range -->
              <div>
                <p class="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">Price Range</p>
                <div class="flex gap-2 mb-3">
                  <div class="flex-1 relative">
                    <span class="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">$</span>
                    <input type="number" id="price-min"
                           class="w-full pl-5 pr-2 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300 transition bg-gray-50"
                           placeholder="Min" min="0" />
                  </div>
                  <div class="flex-1 relative">
                    <span class="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">$</span>
                    <input type="number" id="price-max"
                           class="w-full pl-5 pr-2 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300 transition bg-gray-50"
                           placeholder="Max" min="0" />
                  </div>
                </div>
                <button id="apply-price"
                        class="w-full bg-red-500 hover:bg-red-600 text-white text-xs font-bold py-2 rounded-lg transition-colors">
                  Apply Price
                </button>
              </div>
            </div>
          </div>
        </aside>

        <!-- Main Content -->
        <main class="flex-1 min-w-0">
          <!-- Search + Sort Bar -->
          <div class="flex flex-wrap gap-3 mb-5">
            <button id="mobile-filter-btn"
              class="md:hidden flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white shadow-sm text-gray-700 flex-shrink-0">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"/>
              </svg>
              Filters
            </button>
            <div class="flex-1 relative">
              <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input type="text" id="search-input"
                     class="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300 shadow-sm transition placeholder-gray-400"
                     placeholder="Search products..." />
            </div>
            <select id="sort-select"
                    class="border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-red-200 cursor-pointer shadow-sm min-w-[160px] w-full sm:w-auto text-gray-700">
              <option value="">Sort by</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="name-asc">Name: A → Z</option>
            </select>
          </div>

          <!-- Results count -->
          <div id="results-info" class="text-xs font-medium text-gray-400 mb-4"></div>

          <!-- Grid -->
          <div id="products-grid" class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            ${[...Array(8)].map(() => `<div class="rounded-2xl bg-gray-100 animate-pulse" style="height:280px;"></div>`).join('')}
          </div>
        </main>
      </div>
    </div>
  </div>
`;

export async function init(params = {}) {
  let activeCategories = params.category ? [params.category] : [];
  let searchQuery = '';
  let sortValue = '';
  let minPrice = undefined;
  let maxPrice = undefined;
  let allProducts = [];

  // Pre-check category from URL
  if (activeCategories.length > 0) {
    document.querySelectorAll('.category-filter').forEach(cb => {
      if (activeCategories.includes(cb.value)) cb.checked = true;
    });
  }

  const grid = document.getElementById('products-grid');
  const info = document.getElementById('results-info');

  // Mobile filter drawer
  const aside = document.querySelector('aside');
  const backdrop = document.getElementById('filter-backdrop');
  const mobileFilterBtn = document.getElementById('mobile-filter-btn');
  const closeFilterBtn = document.getElementById('close-filter-btn');

  function openDrawer() {
    aside.classList.remove('-translate-x-full');
    aside.classList.add('translate-x-0');
    backdrop.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    aside.classList.remove('translate-x-0');
    aside.classList.add('-translate-x-full');
    backdrop.classList.add('hidden');
    document.body.style.overflow = '';
  }

  mobileFilterBtn?.addEventListener('click', openDrawer);
  closeFilterBtn?.addEventListener('click', closeDrawer);
  backdrop?.addEventListener('click', closeDrawer);
  window.addEventListener('hashchange', () => { document.body.style.overflow = ''; }, { once: true });

  try {
    allProducts = await getAll();
  } catch (e) {
    grid.innerHTML = '<div class="col-span-4 text-center text-gray-400 py-12">Failed to load products.</div>';
    return;
  }

  function applyFilters(products) {
    let result = products;

    if (activeCategories.length > 0) {
      result = result.filter(p => activeCategories.includes(p.categoryName));
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    if (minPrice !== undefined) result = result.filter(p => p.price >= minPrice);
    if (maxPrice !== undefined) result = result.filter(p => p.price <= maxPrice);

    if (sortValue === 'price-asc') result = [...result].sort((a, b) => a.price - b.price);
    else if (sortValue === 'price-desc') result = [...result].sort((a, b) => b.price - a.price);
    else if (sortValue === 'name-asc') result = [...result].sort((a, b) => a.name.localeCompare(b.name));

    return result;
  }

  function renderProducts() {
    const products = applyFilters(allProducts);
    info.textContent = `${products.length} product${products.length !== 1 ? 's' : ''} found`;

    if (products.length === 0) {
      grid.innerHTML = `<div class="col-span-4 flex flex-col items-center justify-center py-20 text-center">
        <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <svg class="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        </div>
        <p class="text-gray-500 font-semibold mb-1">No products found</p>
        <p class="text-sm text-gray-400">Try adjusting your filters or search term</p>
      </div>`;
    } else {
      grid.innerHTML = products.map(p => productCard(p)).join('');
    }
  }

  renderProducts();

  // Category checkboxes
  document.querySelectorAll('.category-filter').forEach(cb => {
    cb.addEventListener('change', () => {
      activeCategories = Array.from(document.querySelectorAll('.category-filter:checked')).map(c => c.value);
      renderProducts();
      closeDrawer();
    });
  });

  // Search
  let searchTimeout;
  document.getElementById('search-input').addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      searchQuery = e.target.value.trim();
      renderProducts();
    }, 300);
  });

  // Sort
  document.getElementById('sort-select').addEventListener('change', (e) => {
    sortValue = e.target.value;
    renderProducts();
  });

  // Price filter
  document.getElementById('apply-price').addEventListener('click', () => {
    const minVal = document.getElementById('price-min').value;
    const maxVal = document.getElementById('price-max').value;
    minPrice = minVal !== '' ? parseFloat(minVal) : undefined;
    maxPrice = maxVal !== '' ? parseFloat(maxVal) : undefined;
    renderProducts();
    closeDrawer();
  });

  // Clear filters
  document.getElementById('clear-filters').addEventListener('click', () => {
    activeCategories = [];
    searchQuery = '';
    sortValue = '';
    minPrice = undefined;
    maxPrice = undefined;
    document.querySelectorAll('.category-filter').forEach(cb => cb.checked = false);
    document.getElementById('search-input').value = '';
    document.getElementById('sort-select').value = '';
    document.getElementById('price-min').value = '';
    document.getElementById('price-max').value = '';
    renderProducts();
    closeDrawer();
  });

  // Event delegation: cart + wishlist
  grid.addEventListener('click', (e) => {
    const cartBtn = e.target.closest('[data-action="add-to-cart"]');
    if (cartBtn) {
      if (!isLoggedIn()) { showToast('Please sign in to add items to cart', 'error'); navigate('/login'); return; }
      const product = allProducts.find(p => String(p.id) === String(cartBtn.getAttribute('data-product-id')));
      if (product) { addToCart(product, 1); showToast(`${product.name} added to cart!`, 'success'); }
      return;
    }

    const wishBtn = e.target.closest('[data-action="toggle-wishlist"]');
    if (wishBtn) {
      if (!isLoggedIn()) { showToast('Please sign in to save items to wishlist', 'error'); navigate('/login'); return; }
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
    }
  });
}
