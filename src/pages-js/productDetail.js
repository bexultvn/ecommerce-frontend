import { getAll, getById } from '../services/productService.js';
import { addToCart } from '../services/cartService.js';
import { productCard } from '../components/productCard.js';
import { showToast } from '../components/toast.js';
import { navigate } from '../core/router.js';

export const template = `
  <div class="max-w-7xl mx-auto px-6 py-8">
    <div id="breadcrumb" class="flex items-center gap-2 text-sm text-gray-500 mb-8">
      <a href="#/" class="hover:text-black">Account</a>
      <span>/</span>
      <span id="bc-category" class="hover:text-black"></span>
      <span>/</span>
      <span id="bc-name" class="text-black font-medium"></span>
    </div>
    <div id="product-content" class="text-center text-gray-400 py-16">Loading...</div>
    <div id="related-section" class="hidden">
      <div class="flex items-center gap-3 mb-6 mt-16">
        <span class="w-5 h-10 bg-red-500 rounded-sm inline-block"></span>
        <span class="text-red-500 font-semibold text-sm">Related Item</span>
      </div>
      <div id="related-grid" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5"></div>
    </div>
  </div>
`;

export async function init(params = {}) {
  const productId = params.id;
  const content = document.getElementById('product-content');

  const product = productId ? await getById(productId) : null;

  if (!product) {
    content.innerHTML = `<div class="text-center py-16"><p class="text-gray-500 text-lg mb-4">Product not found.</p><a href="#/products" class="text-black underline">Browse all products</a></div>`;
    return;
  }

  const bcCat = document.getElementById('bc-category');
  const bcName = document.getElementById('bc-name');
  if (bcCat) bcCat.textContent = product.categoryName || 'Product';
  if (bcName) bcName.textContent = product.name;

  const qty = product.availableQuantity;
  const stockBadge = qty > 0
    ? `<span class="text-green-600 font-medium text-sm">In Stock</span>`
    : `<span class="text-red-500 font-medium text-sm">Out of Stock</span>`;

  const mainImage = product.image
    ? `<img src="${product.image}" alt="${product.name}" class="w-full h-full object-contain" />`
    : `<div class="w-full h-full flex items-center justify-center text-gray-400">No image</div>`;

  content.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
      <!-- Main Image -->
      <div class="bg-gray-100 rounded-lg h-80 flex items-center justify-center overflow-hidden p-6">
        ${mainImage}
      </div>

      <!-- Product Details -->
      <div class="flex flex-col">
        <h1 class="text-2xl font-semibold mb-2">${product.name}</h1>
        <div class="flex items-center gap-3 mb-3">
          ${stockBadge}
        </div>
        <p class="text-2xl font-medium mb-4">$${Number(product.price).toFixed(2)}</p>
        <p class="text-sm text-gray-600 leading-relaxed mb-4 pb-4 border-b border-gray-200">${product.description}</p>

        ${qty > 0 ? `
          <div class="flex items-center gap-4 my-5">
            <div class="flex items-center border border-gray-300 rounded overflow-hidden">
              <button id="qty-dec" class="w-10 h-11 flex items-center justify-center hover:bg-gray-100 font-bold text-lg border-r border-gray-300">−</button>
              <input type="number" id="qty-input" value="1" min="1" max="${qty}" class="w-14 h-11 text-center text-sm outline-none" />
              <button id="qty-inc" class="w-10 h-11 flex items-center justify-center hover:bg-gray-100 font-bold text-lg border-l border-gray-300">+</button>
            </div>
            <button id="add-to-cart-btn" class="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded font-medium text-sm transition-colors">Buy Now</button>
          </div>
        ` : ''}

        <!-- Delivery info -->
        <div class="border border-gray-200 rounded-lg overflow-hidden mt-4">
          <div class="flex items-start gap-4 p-4 border-b border-gray-100">
            <svg class="w-8 h-8 text-gray-700 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/></svg>
            <div>
              <p class="font-medium text-sm">Free Delivery</p>
              <p class="text-xs text-gray-500 mt-0.5">Enter your postal code for Delivery Availability</p>
            </div>
          </div>
          <div class="flex items-start gap-4 p-4">
            <svg class="w-8 h-8 text-gray-700 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            <div>
              <p class="font-medium text-sm">Return Delivery</p>
              <p class="text-xs text-gray-500 mt-0.5">Free 30 Days Delivery Returns.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  if (qty > 0) {
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
      const q = parseInt(qtyInput.value, 10);
      if (isNaN(q) || q < 1) { showToast('Please enter a valid quantity', 'error'); return; }
      addToCart(product, q);
      showToast(`${product.name} added to cart!`, 'success');
    });
  }

  // Load related products
  try {
    const all = await getAll();
    const related = all.filter(p => p.categoryName === product.categoryName && String(p.id) !== String(product.id)).slice(0, 4);
    const relatedSection = document.getElementById('related-section');
    const relatedGrid = document.getElementById('related-grid');
    if (related.length > 0 && relatedSection && relatedGrid) {
      relatedSection.classList.remove('hidden');
      relatedGrid.innerHTML = related.map(p => productCard(p)).join('');
      relatedGrid.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-action="add-to-cart"]');
        if (!btn) return;
        const pid = btn.getAttribute('data-product-id');
        const p = all.find(x => String(x.id) === String(pid));
        if (p) { addToCart(p, 1); showToast(`${p.name} added to cart!`, 'success'); }
      });
    }
  } catch {}
}
