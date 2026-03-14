import { getCart, removeFromCart, updateQty, getTotal, clearCart } from '../services/cartService.js';
import { createOrder } from '../services/orderService.js';
import { getCurrentUser } from '../services/authService.js';
import { cartItemHTML } from '../components/cartItem.js';
import { showToast } from '../components/toast.js';
import { navigate } from '../core/router.js';

export const template = `
  <div class="max-w-6xl mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-6">Shopping Cart</h1>
    <div id="cart-content"></div>
  </div>
`;

const PAYMENT_METHODS = ['CREDIT_CARD', 'VISA', 'MASTER_CARD', 'PAYPAL', 'BITCOIN'];

function renderCart() {
  const content = document.getElementById('cart-content');
  if (!content) return;

  const cart = getCart();

  if (cart.length === 0) {
    content.innerHTML = `
      <div class="text-center py-16">
        <p class="text-gray-400 text-lg mb-4">Your cart is empty.</p>
        <a href="#/products" class="inline-block bg-black text-white px-6 py-2 rounded hover:bg-gray-800">
          Browse Products
        </a>
      </div>
    `;
    return;
  }

  const total = getTotal();
  const shipping = total > 50 ? 0 : 5.99;
  const grandTotal = total + shipping;

  const paymentOptions = PAYMENT_METHODS.map(m =>
    `<option value="${m}">${m.replace('_', ' ')}</option>`
  ).join('');

  content.innerHTML = `
    <div class="flex flex-col lg:flex-row gap-8">
      <!-- Cart Items -->
      <div class="flex-1">
        <div id="cart-items-list">
          ${cart.map(item => cartItemHTML(item)).join('')}
        </div>
        <button
          id="clear-cart-btn"
          class="mt-4 text-sm text-gray-500 hover:text-red-600 underline"
        >
          Clear cart
        </button>
      </div>

      <!-- Order Summary -->
      <div class="lg:w-72 flex-shrink-0">
        <div class="border border-gray-200 rounded-lg p-5 sticky top-20">
          <h2 class="font-semibold text-lg mb-4">Order Summary</h2>
          <div class="space-y-2 text-sm mb-4">
            <div class="flex justify-between">
              <span class="text-gray-600">Subtotal</span>
              <span>$${total.toFixed(2)}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Shipping</span>
              <span>${shipping === 0 ? '<span class="text-green-600">Free</span>' : '$' + shipping.toFixed(2)}</span>
            </div>
            ${shipping > 0 ? '<p class="text-xs text-gray-400">Free shipping on orders over $50</p>' : ''}
          </div>
          <div class="border-t border-gray-200 pt-3 flex justify-between font-bold text-base mb-4">
            <span>Total</span>
            <span>$${grandTotal.toFixed(2)}</span>
          </div>
          <div class="mb-4">
            <label for="payment-method" class="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
            <select
              id="payment-method"
              class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            >
              ${paymentOptions}
            </select>
          </div>
          <button
            id="checkout-btn"
            class="w-full bg-black text-white py-3 rounded font-semibold hover:bg-gray-800 disabled:opacity-50"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  `;

  // Bind events
  document.getElementById('clear-cart-btn').addEventListener('click', () => {
    clearCart();
    showToast('Cart cleared', 'info');
    renderCart();
  });

  document.getElementById('checkout-btn').addEventListener('click', async () => {
    const user = getCurrentUser();
    if (!user) {
      showToast('Please log in to checkout', 'error');
      navigate('/login');
      return;
    }

    const btn = document.getElementById('checkout-btn');
    const paymentMethod = document.getElementById('payment-method').value;
    btn.disabled = true;
    btn.textContent = 'Placing order...';

    try {
      const currentCart = getCart();
      const orderTotal = getTotal();
      await createOrder(user.id, currentCart, orderTotal, paymentMethod);
      showToast('Order placed successfully!', 'success');
      navigate('/orders');
    } catch (err) {
      showToast('Failed to place order. Please try again.', 'error');
      btn.disabled = false;
      btn.textContent = 'Checkout';
    }
  });

  // Event delegation for cart item controls
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
      const currentCart = getCart();
      const item = currentCart.find(i => i.productId === productId);
      if (item) {
        updateQty(productId, item.qty + 1);
        renderCart();
      }
    } else if (action === 'decrease-qty') {
      const currentCart = getCart();
      const item = currentCart.find(i => i.productId === productId);
      if (item) {
        if (item.qty <= 1) {
          removeFromCart(productId);
          showToast('Item removed', 'info');
        } else {
          updateQty(productId, item.qty - 1);
        }
        renderCart();
      }
    }
  });
}

export function init() {
  renderCart();
}
