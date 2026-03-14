const paymentColors = {
  CREDIT_CARD: 'bg-blue-100 text-blue-800',
  VISA: 'bg-indigo-100 text-indigo-800',
  MASTER_CARD: 'bg-red-100 text-red-800',
  PAYPAL: 'bg-yellow-100 text-yellow-800',
  BITCOIN: 'bg-orange-100 text-orange-800'
};

const statusColors = {
  Processing: 'bg-yellow-100 text-yellow-800',
  Shipped: 'bg-blue-100 text-blue-800',
  Delivered: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800'
};

export function orderCard(order) {
  // Support both mock shape (status, items, total, date) and backend shape (paymentMethod, amount, reference, customerId)
  const displayId = order.reference || order.id;
  const amount = order.amount ?? order.total;
  const date = order.date || (order.createdAt ? order.createdAt.slice(0, 10) : '—');

  let badgeClass, badgeLabel;
  if (order.status) {
    badgeClass = statusColors[order.status] || 'bg-gray-100 text-gray-800';
    badgeLabel = order.status;
  } else if (order.paymentMethod) {
    badgeClass = paymentColors[order.paymentMethod] || 'bg-gray-100 text-gray-800';
    badgeLabel = order.paymentMethod.replace('_', ' ');
  } else {
    badgeClass = 'bg-gray-100 text-gray-800';
    badgeLabel = 'Order';
  }

  const itemsSection = order.items && order.items.length > 0 ? `
    <ul class="space-y-1 mb-3 border-t border-gray-100 pt-3">
      ${order.items.map(item =>
        `<li class="text-sm text-gray-600">${item.name} × ${item.qty} — $${(item.price * item.qty).toFixed(2)}</li>`
      ).join('')}
    </ul>
  ` : '';

  return `
    <div class="border border-gray-200 rounded-lg p-5 mb-4">
      <div class="flex items-center justify-between mb-3">
        <div>
          <span class="text-xs text-gray-500 font-medium uppercase tracking-wide">Reference</span>
          <p class="font-mono text-sm font-semibold">${displayId}</p>
        </div>
        <span class="px-2.5 py-1 rounded-full text-xs font-semibold ${badgeClass}">${badgeLabel}</span>
      </div>
      <div class="flex items-center gap-4 text-sm text-gray-500 mb-3">
        <span>Date: ${date}</span>
        ${order.customerId ? `<span>Customer: ${order.customerId}</span>` : ''}
      </div>
      ${itemsSection}
      <div class="border-t border-gray-100 pt-3 flex justify-end">
        <span class="font-bold text-gray-900">Total: $${typeof amount === 'number' ? amount.toFixed(2) : amount}</span>
      </div>
    </div>
  `;
}
