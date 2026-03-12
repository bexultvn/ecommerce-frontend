const statusColors = {
  Processing: 'bg-yellow-100 text-yellow-800',
  Shipped: 'bg-blue-100 text-blue-800',
  Delivered: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800'
};

export function orderCard(order) {
  const statusClass = statusColors[order.status] || 'bg-gray-100 text-gray-800';
  const itemsList = order.items.map(item =>
    `<li class="text-sm text-gray-600">${item.name} × ${item.qty} — $${(item.price * item.qty).toFixed(2)}</li>`
  ).join('');

  return `
    <div class="border border-gray-200 rounded-lg p-5 mb-4">
      <div class="flex items-center justify-between mb-3">
        <div>
          <span class="text-xs text-gray-500 font-medium uppercase tracking-wide">Order ID</span>
          <p class="font-mono text-sm font-semibold">${order.id}</p>
        </div>
        <span class="px-2.5 py-1 rounded-full text-xs font-semibold ${statusClass}">${order.status}</span>
      </div>
      <div class="flex items-center gap-4 text-sm text-gray-500 mb-3">
        <span>Date: ${order.date}</span>
        <span>Items: ${order.items.reduce((s, i) => s + i.qty, 0)}</span>
      </div>
      <ul class="space-y-1 mb-3 border-t border-gray-100 pt-3">
        ${itemsList}
      </ul>
      <div class="border-t border-gray-100 pt-3 flex justify-end">
        <span class="font-bold text-gray-900">Total: $${order.total.toFixed(2)}</span>
      </div>
    </div>
  `;
}
