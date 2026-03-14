import { getCart, getTotal } from '../services/cartService.js';
import { createOrder } from '../services/orderService.js';
import { getCurrentUser } from '../services/authService.js';
import { showToast } from '../components/toast.js';
import { navigate } from '../core/router.js';

const PAYMENT_METHODS = ['CREDIT_CARD', 'VISA', 'MASTER_CARD', 'PAYPAL', 'BITCOIN'];

export const template = `
  <div class="max-w-7xl mx-auto px-6 py-8">
    <div class="flex items-center gap-2 text-sm text-gray-500 mb-8">
      <a href="#/" class="hover:text-black">Home</a>
      <span>/</span>
      <a href="#/cart" class="hover:text-black">Cart</a>
      <span>/</span>
      <span class="text-black font-medium">Checkout</span>
    </div>

    <div class="flex flex-col lg:flex-row gap-16 max-w-4xl mx-auto">
      <!-- Order Summary -->
      <div class="flex-1">
        <h2 class="text-xl font-semibold mb-6">Order Summary</h2>
        <div id="order-summary">
          <p class="text-sm text-gray-400">Loading...</p>
        </div>
      </div>

      <!-- Payment + Place Order -->
      <div class="w-full lg:w-72 flex-shrink-0">
        <h2 class="text-xl font-semibold mb-6">Payment Method</h2>
        <div class="space-y-2 mb-8">
          ${PAYMENT_METHODS.map((m, i) => `
            <label class="flex items-center gap-3 cursor-pointer py-2 border-b border-gray-100">
              <input type="radio" name="payment" value="${m}" ${i === 0 ? 'checked' : ''} class="accent-red-500" />
              <span class="text-sm">${m.replace(/_/g, ' ')}</span>
            </label>
          `).join('')}
        </div>
        <div id="total-display" class="text-sm space-y-2 border-t border-gray-200 pt-4 mb-6"></div>
        <button id="place-order-btn" class="w-full bg-red-500 hover:bg-red-600 text-white py-3.5 rounded font-medium text-sm transition-colors">
          Place Order
        </button>
      </div>
    </div>
  </div>
`;

export async function init() {
  const user = getCurrentUser();
  const cart = getCart();
  const subtotal = getTotal();
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  const summaryEl = document.getElementById('order-summary');
  const totalEl = document.getElementById('total-display');

  if (cart.length === 0) {
    summaryEl.innerHTML = `<p class="text-gray-400">Your cart is empty. <a href="#/products" class="underline text-black">Browse products</a></p>`;
    return;
  }

  summaryEl.innerHTML = `
    <div class="border border-gray-200 rounded overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-gray-50">
          <tr>
            <th class="text-left px-4 py-3 font-medium text-gray-600">Product</th>
            <th class="text-left px-4 py-3 font-medium text-gray-600">Qty</th>
            <th class="text-right px-4 py-3 font-medium text-gray-600">Price</th>
          </tr>
        </thead>
        <tbody>
          ${cart.map(item => `
            <tr class="border-t border-gray-100">
              <td class="px-4 py-3 text-gray-800">${item.name}</td>
              <td class="px-4 py-3 text-gray-500">${item.qty}</td>
              <td class="px-4 py-3 text-right font-medium">$${(item.price * item.qty).toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;

  totalEl.innerHTML = `
    <div class="flex justify-between"><span>Subtotal</span><span>$${subtotal.toFixed(2)}</span></div>
    <div class="flex justify-between"><span>Shipping</span><span>${shipping === 0 ? 'Free' : '$' + shipping.toFixed(2)}</span></div>
    <div class="flex justify-between font-semibold text-base pt-2 border-t border-gray-200"><span>Total</span><span>$${total.toFixed(2)}</span></div>
  `;

  document.getElementById('place-order-btn').addEventListener('click', async () => {
    const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value || 'CREDIT_CARD';
    const btn = document.getElementById('place-order-btn');
    btn.disabled = true;
    btn.textContent = 'Placing order...';

    try {
      await createOrder(user.id, cart, total, paymentMethod);
      showToast('Order placed successfully!', 'success');
      navigate('/orders');
    } catch (err) {
      showToast('Failed to place order. Please try again.', 'error');
      btn.disabled = false;
      btn.textContent = 'Place Order';
    }
  });
}
