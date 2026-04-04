import { getCart, getTotal, clearCart } from '../services/cartService.js';
import { createOrder } from '../services/orderService.js';
import { getCurrentUser } from '../services/authService.js';
import { showToast } from '../components/toast.js';
import { navigate } from '../core/router.js';

const PAYMENT_METHODS = ['CREDIT_CARD', 'VISA', 'MASTER_CARD', 'PAYPAL', 'BITCOIN'];

const PAYMENT_ICONS = {
  CREDIT_CARD: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>`,
  VISA: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>`,
  MASTER_CARD: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>`,
  PAYPAL: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>`,
  BITCOIN: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
};

export const template = `
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 py-8">

      <!-- Step Indicator -->
      <div class="flex items-center justify-center gap-0 mb-10">
        <div class="flex items-center gap-1.5">
          <div class="w-7 h-7 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center text-xs font-bold flex-shrink-0">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
          </div>
          <span class="text-xs font-medium text-gray-400 hidden sm:inline">Cart</span>
        </div>
        <div class="w-8 sm:w-12 h-px bg-gray-300 mx-2 sm:mx-3"></div>
        <div class="flex items-center gap-1.5">
          <div class="w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">2</div>
          <span class="text-xs font-semibold text-gray-900">Checkout</span>
        </div>
        <div class="w-8 sm:w-12 h-px bg-gray-200 mx-2 sm:mx-3"></div>
        <div class="flex items-center gap-1.5">
          <div class="w-7 h-7 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center text-xs font-bold flex-shrink-0">3</div>
          <span class="text-xs font-medium text-gray-400 hidden sm:inline">Confirmation</span>
        </div>
      </div>

      <div class="flex flex-col lg:flex-row gap-8 items-start">

        <!-- Left: Order Summary -->
        <div class="flex-1 min-w-0">
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
            <div class="px-6 py-4 border-b border-gray-100">
              <h2 class="font-bold text-gray-900">Order Summary</h2>
            </div>
            <div id="order-summary" class="px-6 py-4">
              <p class="text-sm text-gray-400">Loading...</p>
            </div>
          </div>

          <!-- Payment Method -->
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-100">
              <h2 class="font-bold text-gray-900">Payment Method</h2>
            </div>
            <div class="px-6 py-4">
              <div class="grid grid-cols-1 gap-2">
                ${PAYMENT_METHODS.map((m, i) => `
                  <label class="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-150
                                has-checked:border-red-300 has-checked:bg-red-50
                                border-gray-100 hover:border-gray-300">
                    <input type="radio" name="payment" value="${m}" ${i === 0 ? 'checked' : ''} class="accent-red-500 w-4 h-4" />
                    <span class="text-gray-500">${PAYMENT_ICONS[m]}</span>
                    <span class="text-sm font-medium text-gray-700">${m.replace(/_/g, ' ')}</span>
                  </label>
                `).join('')}
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Total + CTA -->
        <div class="w-full lg:w-72 flex-shrink-0 sticky top-24">
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-100">
              <h2 class="font-bold text-gray-900">Total</h2>
            </div>
            <div class="px-6 py-5 space-y-4">
              <div id="total-display" class="space-y-2.5 text-sm"></div>
              <button id="place-order-btn"
                      class="w-full text-white font-semibold py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center gap-2"
                      style="background:linear-gradient(135deg,#ef4444,#dc2626);box-shadow:0 6px 24px rgba(239,68,68,0.35);">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                Place Order
              </button>
              <p class="text-xs text-gray-400 text-center flex items-center justify-center gap-1.5">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                Secure &amp; encrypted
              </p>
            </div>
          </div>
          <a href="#/cart" class="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400 hover:text-gray-700 transition-colors">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            Back to Cart
          </a>
        </div>
      </div>
    </div>
  </div>
`;

export async function init() {
  const user = getCurrentUser();
  const cart = await getCart();
  const subtotal = getTotal();
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  const summaryEl = document.getElementById('order-summary');
  const totalEl = document.getElementById('total-display');

  if (cart.length === 0) {
    summaryEl.innerHTML = `<div class="text-center py-6">
      <p class="text-gray-400 text-sm mb-3">Your cart is empty.</p>
      <a href="#/products" class="text-sm font-semibold text-red-500 hover:underline">Browse products</a>
    </div>`;
    return;
  }

  summaryEl.innerHTML = `
    <div class="space-y-3">
      ${cart.map(item => `
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex-shrink-0 overflow-hidden">
            ${item.image
              ? `<img src="${item.image}" alt="${item.name}" class="w-full h-full object-contain p-1" />`
              : `<div class="w-full h-full flex items-center justify-center text-gray-300"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg></div>`
            }
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-800 truncate">${item.name}</p>
            <p class="text-xs text-gray-400">Qty: ${item.qty}</p>
          </div>
          <p class="text-sm font-bold text-gray-900 flex-shrink-0">$${(item.price * item.qty).toFixed(2)}</p>
        </div>
      `).join('')}
    </div>
  `;

  totalEl.innerHTML = `
    <div class="flex justify-between text-gray-600">
      <span>Subtotal</span><span class="font-medium text-gray-900">$${subtotal.toFixed(2)}</span>
    </div>
    <div class="flex justify-between text-gray-600">
      <span>Shipping</span>
      <span class="${shipping === 0 ? 'text-emerald-600 font-medium' : 'font-medium text-gray-900'}">
        ${shipping === 0 ? 'Free' : '$' + shipping.toFixed(2)}
      </span>
    </div>
    <div class="flex justify-between font-bold text-gray-900 border-t border-gray-100 pt-2.5 mt-1 text-base">
      <span>Total</span><span>$${total.toFixed(2)}</span>
    </div>
  `;

  document.getElementById('place-order-btn').addEventListener('click', async () => {
    const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value || 'CREDIT_CARD';
    const btn = document.getElementById('place-order-btn');
    btn.disabled = true;
    btn.innerHTML = `<svg class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg> Placing order...`;

    try {
      await createOrder(user.id, cart, total, paymentMethod);
      await clearCart();
      showToast('Order placed successfully! 🎉', 'success');
      navigate('/orders');
    } catch (err) {
      showToast('Failed to place order. Please try again.', 'error');
      btn.disabled = false;
      btn.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg> Place Order`;
    }
  });
}
