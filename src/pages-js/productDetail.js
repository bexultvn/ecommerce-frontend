import { getById } from '../services/productService.js';
import { addToCart } from '../services/cartService.js';
import { showToast } from '../components/toast.js';
import { navigate } from '../core/router.js';

export const template = `
  <div class="max-w-6xl mx-auto px-4 py-8">
    <button id="back-btn" class="text-sm text-gray-500 hover:text-black mb-6 flex items-center gap-1">
      &#8592; Back to Products
    </button>
    <div id="product-content" class="text-center text-gray-400 py-16">Loading...</div>
  </div>
`;

export function init(params = {}) {
  const productId = params.id;
  const product = productId ? getById(productId) : null;

  document.getElementById('back-btn').addEventListener('click', () => {
    navigate('/products');
  });

  const content = document.getElementById('product-content');

  if (!product) {
    content.innerHTML = `
      <div class="text-center py-16">
        <p class="text-gray-500 text-lg mb-4">Product not found.</p>
        <a href="#/products" class="text-black underline">Browse all products</a>
      </div>
    `;
    return;
  }

  const stockBadge = product.stock > 0
    ? `<span class="text-green-600 font-medium text-sm">In Stock (${product.stock} available)</span>`
    : `<span class="text-red-600 font-medium text-sm">Out of Stock</span>`;

  content.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
      <div>
        <img
          src="${product.image}"
          alt="${product.name}"
          class="w-full rounded-lg border border-gray-200 object-cover bg-gray-100"
        />
      </div>
      <div class="flex flex-col">
        <span class="text-xs text-gray-500 uppercase tracking-wide mb-2">${product.category}</span>
        <h1 class="text-3xl font-bold mb-2">${product.name}</h1>
        <div class="flex items-center gap-2 mb-3">
          <span class="text-yellow-500">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
          <span class="text-sm text-gray-600">${product.rating} / 5</span>
        </div>
        <p class="text-3xl font-bold mb-4">$${product.price.toFixed(2)}</p>
        <p class="text-gray-600 text-sm leading-relaxed mb-4">${product.description}</p>
        <div class="mb-5">${stockBadge}</div>

        ${product.stock > 0 ? `
          <div class="flex items-center gap-3 mb-5">
            <label class="text-sm font-medium">Qty:</label>
            <div class="flex items-center border border-gray-300 rounded">
              <button id="qty-dec" class="w-9 h-9 flex items-center justify-center hover:bg-gray-100 font-bold text-lg">−</button>
              <input
                type="number"
                id="qty-input"
                value="1"
                min="1"
                max="${product.stock}"
                class="w-12 h-9 text-center border-x border-gray-300 text-sm focus:outline-none"
              />
              <button id="qty-inc" class="w-9 h-9 flex items-center justify-center hover:bg-gray-100 font-bold text-lg">+</button>
            </div>
          </div>
          <button
            id="add-to-cart-btn"
            class="bg-black text-white py-3 px-8 rounded font-semibold hover:bg-gray-800 w-full md:w-auto"
          >
            Add to Cart
          </button>
        ` : ''}
      </div>
    </div>
  `;

  if (product.stock > 0) {
    const qtyInput = document.getElementById('qty-input');
    const decBtn = document.getElementById('qty-dec');
    const incBtn = document.getElementById('qty-inc');
    const addBtn = document.getElementById('add-to-cart-btn');

    decBtn.addEventListener('click', () => {
      const current = parseInt(qtyInput.value, 10);
      if (current > 1) qtyInput.value = current - 1;
    });

    incBtn.addEventListener('click', () => {
      const current = parseInt(qtyInput.value, 10);
      if (current < product.stock) qtyInput.value = current + 1;
    });

    addBtn.addEventListener('click', () => {
      const qty = parseInt(qtyInput.value, 10);
      if (isNaN(qty) || qty < 1) {
        showToast('Please enter a valid quantity', 'error');
        return;
      }
      addToCart(product, qty);
      showToast(`${product.name} added to cart!`, 'success');
    });
  }
}
