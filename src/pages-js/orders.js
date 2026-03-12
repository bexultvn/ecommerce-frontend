import { getOrders } from '../services/orderService.js';
import { getCurrentUser } from '../services/authService.js';
import { orderCard } from '../components/orderCard.js';

export const template = `
  <div class="max-w-3xl mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-6">My Orders</h1>
    <div id="orders-list"></div>
  </div>
`;

export function init() {
  const list = document.getElementById('orders-list');
  const user = getCurrentUser();

  if (!user) {
    list.innerHTML = '<p class="text-gray-500">Please log in to view your orders.</p>';
    return;
  }

  const orders = getOrders(user.id);

  if (orders.length === 0) {
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
  const sorted = [...orders].sort((a, b) => new Date(b.date) - new Date(a.date));
  list.innerHTML = sorted.map(o => orderCard(o)).join('');
}
