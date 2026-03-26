import { getCart, removeFromCart, updateQty, getTotal } from '../services/cartService.js';
import { getCurrentUser } from '../services/authService.js';
import { cartItemHTML } from '../components/cartItem.js';
import { showToast } from '../components/toast.js';
import { navigate } from '../core/router.js';

const FREE_SHIPPING_THRESHOLD = 140;
const SHIPPING_COST = 5.99;

export const template = `
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8">

      <!-- Header -->
      <div class="flex flex-wrap items-start justify-between gap-3 mb-8">
        <div>
          <h1 class="text-xl sm:text-2xl font-bold text-gray-900">Shopping Cart</h1>
          <p id="cart-item-count" class="text-sm text-gray-400 mt-0.5"></p>
        </div>
        <a href="#/products" class="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors flex-shrink-0">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          Continue Shopping
        </a>
      </div>

      <div id="cart-content"></div>
    </div>
  </div>
`;

function renderCart() {
  const content = document.getElementById('cart-content');
  const countEl = document.getElementById('cart-item-count');
  if (!content) return;

  const cart = getCart();
  const totalItems = cart.reduce((s, i) => s + i.qty, 0);

  if (countEl) {
    countEl.textContent = cart.length === 0 ? '' : `${totalItems} item${totalItems !== 1 ? 's' : ''}`;
  }

  if (cart.length === 0) {
    content.innerHTML = `
      <div class="flex flex-col items-center justify-center py-24 text-center">
        <div class="w-28 h-28 rounded-full bg-gray-100 flex items-center justify-center mb-6">
          <svg class="w-14 h-14 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
        <p class="text-gray-400 text-sm mb-8 max-w-xs">Looks like you haven't added anything yet. Start browsing and find something you love.</p>
        <a href="#/products"
           class="inline-flex items-center gap-2 text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
           style="background:linear-gradient(135deg,#ef4444,#dc2626);box-shadow:0 6px 24px rgba(239,68,68,0.35);">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
          Browse Products
        </a>
      </div>
    `;
    return;
  }

  const subtotal = getTotal();
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
  const progress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

  content.innerHTML = `
    <div class="flex flex-col lg:flex-row gap-8 items-start">

      <!-- Items List -->
      <div class="flex-1 min-w-0">
        <!-- Column headers (desktop) -->
        <div class="hidden md:grid grid-cols-[1fr_auto_auto_auto] gap-4 px-4 mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
          <span>Product</span>
          <span class="text-center w-28">Quantity</span>
          <span class="text-right w-20">Total</span>
          <span class="w-8"></span>
        </div>

        <!-- Cart Items -->
        <div id="cart-items-list" class="space-y-3">
          ${cart.map(item => cartItemHTML(item)).join('')}
        </div>

        <!-- Bottom actions -->
        <div class="flex items-center justify-between mt-6 pt-5 border-t border-gray-200">
          <a href="#/products" class="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 border border-gray-200 px-5 py-2.5 rounded-xl hover:bg-white transition-all">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            Continue Shopping
          </a>
          <button id="clear-cart-btn" class="text-xs text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1.5">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            Clear cart
          </button>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="w-full lg:w-80 flex-shrink-0 sticky top-24">
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

          <!-- Summary Header -->
          <div class="px-6 py-5 border-b border-gray-100">
            <h3 class="font-bold text-gray-900 text-base">Order Summary</h3>
          </div>

          <div class="px-6 py-5 space-y-5">

            <!-- Free Shipping Progress -->
            <div class="rounded-xl p-3.5 ${subtotal >= FREE_SHIPPING_THRESHOLD ? 'bg-emerald-50 border border-emerald-100' : 'bg-gray-50 border border-gray-100'}">
              ${subtotal >= FREE_SHIPPING_THRESHOLD
                ? `<div class="flex items-center gap-2 text-emerald-600">
                     <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                     <span class="text-sm font-semibold">You've got free shipping!</span>
                   </div>`
                : `<div>
                     <p class="text-xs text-gray-500 mb-2">
                       Spend <span class="font-semibold text-gray-800">$${remaining.toFixed(2)}</span> more for free shipping
                     </p>
                     <div class="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                       <div class="h-full bg-gradient-to-r from-red-500 to-orange-400 rounded-full transition-all duration-500" style="width:${progress}%"></div>
                     </div>
                   </div>`
              }
            </div>

            <!-- Line items -->
            <div class="space-y-3 text-sm">
              <div class="flex justify-between text-gray-600">
                <span>Subtotal <span class="text-gray-400">(${totalItems} item${totalItems !== 1 ? 's' : ''})</span></span>
                <span class="font-medium text-gray-900">$${subtotal.toFixed(2)}</span>
              </div>
              <div class="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span class="${shipping === 0 ? 'text-emerald-600 font-medium' : 'text-gray-900 font-medium'}">
                  ${shipping === 0 ? 'Free' : '$' + shipping.toFixed(2)}
                </span>
              </div>
            </div>

            <!-- Divider -->
            <div class="border-t border-gray-100"></div>

            <!-- Total -->
            <div class="flex justify-between items-center">
              <span class="font-bold text-gray-900">Total</span>
              <span class="text-xl font-black text-gray-900">$${total.toFixed(2)}</span>
            </div>

            <!-- Checkout Button -->
            <button id="checkout-btn"
              class="w-full text-white font-semibold py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center gap-2"
              style="background:linear-gradient(135deg,#ef4444,#dc2626);box-shadow:0 6px 24px rgba(239,68,68,0.35);">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
              Proceed to Checkout
            </button>

            <!-- Security note -->
            <p class="text-xs text-gray-400 text-center flex items-center justify-center gap-1.5">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
              Secure & encrypted checkout
            </p>
          </div>
        </div>

        <!-- Accepted Payments -->
        <p class="text-center text-xs text-gray-400 mt-4">We accept Credit Card, Visa, Mastercard &amp; PayPal</p>
      </div>
    </div>
  `;

  // Checkout
  document.getElementById('checkout-btn').addEventListener('click', () => {
    const user = getCurrentUser();
    if (!user) {
      showToast('Please sign in to checkout', 'error');
      navigate('/login');
      return;
    }
    navigate('/checkout');
  });

  // Clear cart
  document.getElementById('clear-cart-btn')?.addEventListener('click', () => {
    import('../services/cartService.js').then(({ clearCart }) => {
      clearCart();
      showToast('Cart cleared', 'info');
      renderCart();
    });
  });

  // Item actions (delegation)
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
