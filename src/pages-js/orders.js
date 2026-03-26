import { getOrders } from '../services/orderService.js';
import { getCurrentUser } from '../services/authService.js';
import { orderCard } from '../components/orderCard.js';
import { config } from '../config/config.js';

export const template = `
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div class="flex items-center gap-4 mb-8">
        <div class="w-11 h-11 rounded-2xl bg-red-50 flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
        </div>
        <div>
          <h1 class="text-xl font-bold text-gray-900">My Orders</h1>
          <p class="text-sm text-gray-400 mt-0.5">Track and manage your purchases</p>
        </div>
      </div>
      <div id="orders-list"></div>
    </div>
  </div>
`;

export async function init() {
  const list = document.getElementById('orders-list');
  const user = getCurrentUser();

  if (!user) {
    list.innerHTML = `
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
        <p class="text-gray-500 mb-4">Please sign in to view your orders.</p>
        <a href="#/login" class="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors">
          Sign In
        </a>
      </div>`;
    return;
  }

  list.innerHTML = `
    <div class="space-y-3">
      ${[...Array(3)].map(() => `<div class="h-20 rounded-2xl bg-gray-100 animate-pulse"></div>`).join('')}
    </div>`;

  try {
    const orders = await getOrders(user.id);

    const filtered = config.USE_MOCK
      ? orders
      : orders.filter(o => String(o.customerId) === String(user.id));

    if (filtered.length === 0) {
      list.innerHTML = `
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center py-20 text-center px-6">
          <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <svg class="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
          </div>
          <h2 class="text-gray-700 font-semibold mb-1">No orders yet</h2>
          <p class="text-sm text-gray-400 mb-6 max-w-xs">When you place an order, it will appear here.</p>
          <a href="#/products"
             class="inline-flex items-center gap-2 text-white font-semibold px-7 py-3 rounded-xl transition-all hover:-translate-y-0.5"
             style="background:linear-gradient(135deg,#ef4444,#dc2626);box-shadow:0 4px 16px rgba(239,68,68,0.3);">
            Start Shopping
          </a>
        </div>`;
      return;
    }

    const sorted = [...filtered].sort((a, b) => {
      const dateA = new Date(a.date || a.createdAt || 0);
      const dateB = new Date(b.date || b.createdAt || 0);
      return dateB - dateA;
    });

    list.innerHTML = `<div class="space-y-3">${sorted.map(o => orderCard(o)).join('')}</div>`;
  } catch (err) {
    list.innerHTML = `
      <div class="bg-white rounded-2xl border border-red-100 shadow-sm p-6 text-center">
        <p class="text-red-500 text-sm font-medium">Failed to load orders. Please try again.</p>
      </div>`;
  }
}
