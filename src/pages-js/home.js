import { getFeatured } from '../services/productService.js';
import { addToCart } from '../services/cartService.js';
import { productCard } from '../components/productCard.js';
import { showToast } from '../components/toast.js';
import { navigate } from '../core/router.js';
import { lsGetAll } from '../storage/localStorage.js';

export const template = `
  <div>
    <!-- Hero Section -->
    <section class="bg-gray-900 text-white py-20 px-4">
      <div class="max-w-4xl mx-auto text-center">
        <h1 class="text-4xl font-bold mb-4">Shop the Latest Products</h1>
        <p class="text-gray-300 text-lg mb-8">Discover Electronics, Clothing, Books, and more — all in one place.</p>
        <a href="#/products" class="inline-block bg-white text-black px-8 py-3 rounded font-semibold hover:bg-gray-100">
          Shop Now
        </a>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="max-w-6xl mx-auto px-4 py-12">
      <h2 class="text-2xl font-bold mb-6">Featured Products</h2>
      <div id="featured-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="col-span-4 text-center text-gray-400 py-8">Loading...</div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="bg-gray-50 py-12 px-4">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-2xl font-bold mb-6">Shop by Category</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            class="border border-gray-200 bg-white rounded-lg p-6 text-center hover:shadow-md hover:border-gray-400 transition-all"
            data-category="Electronics"
          >
            <div class="text-3xl mb-2">&#128187;</div>
            <div class="font-semibold">Electronics</div>
          </button>
          <button
            class="border border-gray-200 bg-white rounded-lg p-6 text-center hover:shadow-md hover:border-gray-400 transition-all"
            data-category="Clothing"
          >
            <div class="text-3xl mb-2">&#128248;</div>
            <div class="font-semibold">Clothing</div>
          </button>
          <button
            class="border border-gray-200 bg-white rounded-lg p-6 text-center hover:shadow-md hover:border-gray-400 transition-all"
            data-category="Books"
          >
            <div class="text-3xl mb-2">&#128218;</div>
            <div class="font-semibold">Books</div>
          </button>
          <button
            class="border border-gray-200 bg-white rounded-lg p-6 text-center hover:shadow-md hover:border-gray-400 transition-all"
            data-category="Home"
          >
            <div class="text-3xl mb-2">&#127968;</div>
            <div class="font-semibold">Home</div>
          </button>
        </div>
      </div>
    </section>
  </div>
`;

export function init() {
  const grid = document.getElementById('featured-grid');

  const featured = getFeatured();
  if (featured.length === 0) {
    grid.innerHTML = '<div class="col-span-4 text-center text-gray-400 py-8">No products found.</div>';
  } else {
    grid.innerHTML = featured.map(p => productCard(p)).join('');
  }

  // Category buttons
  document.querySelectorAll('[data-category]').forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-category');
      navigate(`/products?category=${encodeURIComponent(category)}`);
    });
  });

  // Add to cart via event delegation
  grid.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action="add-to-cart"]');
    if (!btn) return;
    const productId = btn.getAttribute('data-product-id');
    const products = lsGetAll('products');
    const product = products.find(p => p.id === productId);
    if (product) {
      addToCart(product, 1);
      showToast(`${product.name} added to cart!`, 'success');
    }
  });
}
