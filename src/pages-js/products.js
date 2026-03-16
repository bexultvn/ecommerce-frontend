import { getAll } from '../services/productService.js';
import { addToCart } from '../services/cartService.js';
import { productCard } from '../components/productCard.js';
import { showToast } from '../components/toast.js';

export const template = `
  <div class="max-w-6xl mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-6">All Products</h1>
    <div class="flex gap-6">
      <!-- Sidebar Filters -->
      <aside class="w-56 flex-shrink-0 self-start">
        <div class="border border-gray-200 rounded-lg p-4">
          <h2 class="font-semibold mb-3">Categories</h2>
          <div class="space-y-2 mb-5">
            <label class="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" class="category-filter" value="Electronics" /> Electronics
            </label>
            <label class="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" class="category-filter" value="Clothing" /> Clothing
            </label>
            <label class="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" class="category-filter" value="Books" /> Books
            </label>
            <label class="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" class="category-filter" value="Home" /> Home
            </label>
          </div>

          <h2 class="font-semibold mb-3">Price Range</h2>
          <div class="space-y-2 mb-5">
            <div class="flex gap-2">
              <input
                type="number"
                id="price-min"
                class="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                placeholder="Min"
                min="0"
              />
              <input
                type="number"
                id="price-max"
                class="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                placeholder="Max"
                min="0"
              />
            </div>
            <button
              id="apply-price"
              class="w-full border border-gray-300 text-sm py-1.5 rounded hover:bg-gray-50"
            >
              Apply
            </button>
          </div>

          <button
            id="clear-filters"
            class="w-full text-sm text-gray-500 hover:text-black underline text-left"
          >
            Clear all filters
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 min-w-0">
        <div class="flex gap-3 mb-6">
          <input
            type="text"
            id="search-input"
            class="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Search products..."
          />
          <select
            id="sort-select"
            class="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none"
          >
            <option value="">Sort by</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A-Z</option>
          </select>
        </div>

        <div id="results-info" class="text-sm text-gray-500 mb-4"></div>
        <div id="products-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div class="col-span-3 text-center text-gray-400 py-12">Loading...</div>
        </div>
      </main>
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

  try {
    allProducts = await getAll();
  } catch (e) {
    grid.innerHTML = '<div class="col-span-3 text-center text-gray-400 py-12">Failed to load products.</div>';
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
      grid.innerHTML = '<div class="col-span-3 text-center text-gray-400 py-12">No products match your filters.</div>';
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
  });

  // Add to cart via event delegation
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
}
