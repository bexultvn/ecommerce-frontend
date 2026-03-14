import { getOrders } from '../services/orderService.js';
import { getCurrentUser } from '../services/authService.js';
import { orderCard } from '../components/orderCard.js';
import { config } from '../config/config.js';

export const template = `
  <div class="max-w-3xl mx-auto px-4 py-8">
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
        <div class="text-center py-16">
          <p class="text-gray-400 text-lg mb-4">You have no orders yet.</p>
          <a href="#/products" class="inline-block bg-black text-white px-6 py-2 rounded hover:bg-gray-800">
            Start Shopping
          </a>
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
