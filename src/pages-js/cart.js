import { getCart, removeFromCart, updateQty, getTotal, clearCart } from '../services/cartService.js';
import { getCurrentUser } from '../services/authService.js';
import { cartItemHTML } from '../components/cartItem.js';
import { showToast } from '../components/toast.js';
import { navigate } from '../core/router.js';

export const template = `
  <div class="max-w-7xl mx-auto px-6 py-8">
    <button onclick="history.back()" class="flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-8 transition-colors">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
      Back
    </button>
    <div id="cart-content"></div>
  </div>
`;

function renderCart() {
  const content = document.getElementById('cart-content');
  if (!content) return;

  const cart = getCart();

  if (cart.length === 0) {
    content.innerHTML = `
      <div class="text-center py-20">
        <p class="text-gray-400 text-lg mb-6">Your cart is empty.</p>
        <a href="#/products" class="inline-block bg-red-500 hover:bg-red-600 text-white px-10 py-3 rounded text-sm font-medium transition-colors">Browse Products</a>
      </div>
    `;
    return;
  }

  const subtotal = getTotal();
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  content.innerHTML = `
    <!-- Cart Table -->
    <div class="shadow-sm rounded border border-gray-200 overflow-x-auto mb-6">
      <table class="w-full min-w-[600px]">
        <thead>
          <tr class="bg-white text-sm font-medium text-gray-700">
            <th class="text-left px-6 py-4 font-medium">Product</th>
            <th class="text-left px-4 py-4 font-medium">Price</th>
            <th class="text-left px-4 py-4 font-medium">Quantity</th>
            <th class="text-left px-4 py-4 font-medium">Subtotal</th>
          </tr>
        </thead>
        <tbody id="cart-items-list" class="px-6">
          ${cart.map(item => cartItemHTML(item)).join('')}
        </tbody>
      </table>
    </div>

    <!-- Action Buttons -->
    <div class="flex justify-between mb-8">
      <a href="#/products" class="border border-gray-300 px-8 py-3 rounded text-sm font-medium hover:bg-gray-50 transition-colors">Return To Shop</a>
    </div>

    <!-- Cart Total -->
    <div class="flex justify-end">
      <div
      <div class="border border-gray-300 rounded p-6 w-full lg:w-72 flex-shrink-0">
        <h3 class="font-semibold text-base mb-4">Cart Total</h3>
        <div class="space-y-3 text-sm border-b border-gray-200 pb-4 mb-4">
          <div class="flex justify-between">
            <span>Subtotal:</span>
            <span>$${subtotal.toFixed(2)}</span>
          </div>
          <div class="flex justify-between border-t border-gray-200 pt-3">
            <span>Shipping:</span>
            <span>${shipping === 0 ? 'Free' : '$' + shipping.toFixed(2)}</span>
          </div>
          <div class="flex justify-between border-t border-gray-200 pt-3 font-semibold">
            <span>Total:</span>
            <span>$${total.toFixed(2)}</span>
          </div>
        </div>
        <button id="checkout-btn" class="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded text-sm font-medium transition-colors">
          Proceed to Checkout
        </button>
      </div>
    </div>
  `;

  document.getElementById('checkout-btn').addEventListener('click', () => {
    const user = getCurrentUser();
    if (!user) {
      showToast('Please log in to checkout', 'error');
      navigate('/login');
      return;
    }
    navigate('/checkout');
  });

  document.getElementById('cart-items-list').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const productId = btn.getAttribute('data-product-id');
    const action = btn.getAttribute('data-action');
    if (action === 'remove-item') {
      removeFromCart(productId);
      showToast('Item removed', 'info');
      renderCart();
    } else if (action === 'increase-qty') {
      const item = getCart().find(i => i.productId === productId);
      if (item) { updateQty(productId, item.qty + 1); renderCart(); }
    } else if (action === 'decrease-qty') {
      const item = getCart().find(i => i.productId === productId);
      if (item) {
        if (item.qty <= 1) { removeFromCart(productId); showToast('Item removed', 'info'); }
        else updateQty(productId, item.qty - 1);
        renderCart();
      }
    }
  });
}

export function init() {
  renderCart();
}
