import { getOrders } from '../services/orderService.js';
import { getCurrentUser } from '../services/authService.js';
import { orderCard } from '../components/orderCard.js';
import { config } from '../config/config.js';

export const template = `
  <div class="max-w-7xl mx-auto px-6 py-8">
    <button onclick="history.back()" class="flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-8 transition-colors">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
      Back
    </button>
    <h1 class="text-2xl font-bold mb-6">My Orders</h1>
    <div id="orders-list"></div>
  </div>
`;

export async function init() {
  const list = document.getElementById('orders-list');
  const user = getCurrentUser();

  if (!user) {
    list.innerHTML = '<p class="text-gray-500">Please log in to view your orders.</p>';
    return;
  }

  list.innerHTML = '<p class="text-gray-400">Loading orders...</p>';

  try {
    // Pass userId for mock filtering; real API returns all (filtered server-side by auth in future)
    const orders = await getOrders(user.id);

    // In real API mode, filter by customerId since backend returns all orders
    const filtered = config.USE_MOCK
      ? orders
      : orders.filter(o => String(o.customerId) === String(user.id));

    if (filtered.length === 0) {
      list.innerHTML = `
        <div class="text-center py-20">
          <p class="text-gray-400 text-lg mb-6">You have no orders yet.</p>
          <a href="#/products" class="inline-block bg-red-500 hover:bg-red-600 text-white px-10 py-3 rounded text-sm font-medium transition-colors">Browse Products</a>
        </div>
      `;
      return;
    }

    // Sort by date descending (newest first)
    const sorted = [...filtered].sort((a, b) => {
      const dateA = new Date(a.date || a.createdAt || 0);
      const dateB = new Date(b.date || b.createdAt || 0);
      return dateB - dateA;
    });

    list.innerHTML = sorted.map(o => orderCard(o)).join('');
  } catch (err) {
    list.innerHTML = '<p class="text-red-500">Failed to load orders. Please try again.</p>';
  }
}
