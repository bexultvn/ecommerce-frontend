const statusConfig = {
  Processing: { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', dot: 'bg-yellow-400', icon: '⏳' },
  Shipped:    { color: 'bg-blue-100 text-blue-700 border-blue-200',       dot: 'bg-blue-400',   icon: '🚚' },
  Delivered:  { color: 'bg-green-100 text-green-700 border-green-200',    dot: 'bg-green-400',  icon: '✅' },
  Cancelled:  { color: 'bg-red-100 text-red-700 border-red-200',          dot: 'bg-red-400',    icon: '✕'  },
};

export function orderCard(order) {
  const displayId = order.reference || order.id;
  const amount = order.amount ?? order.total ?? 0;
  const date = order.date || (order.createdAt ? order.createdAt.slice(0, 10) : '—');
  const status = order.status || 'Processing';
  const cfg = statusConfig[status] || { color: 'bg-gray-100 text-gray-700 border-gray-200', dot: 'bg-gray-400', icon: '•' };
  const itemCount = order.items?.length ?? 0;
  const cardId = `order-${displayId}`;

  const steps = ['Processing', 'Shipped', 'Delivered'];
  const stepIndex = steps.indexOf(status);
  const isCancelled = status === 'Cancelled';

  const tracker = isCancelled ? `
    <div class="flex items-center gap-2 text-red-500 text-xs font-medium">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
      Order Cancelled
    </div>
  ` : `
    <div class="flex items-center gap-0 w-full mt-1">
      ${steps.map((step, i) => {
        const done = i <= stepIndex;
        const active = i === stepIndex;
        return `
          <div class="flex items-center ${i < steps.length - 1 ? 'flex-1' : ''}">
            <div class="flex flex-col items-center gap-1">
              <div class="w-7 h-7 rounded-full flex items-center justify-center border-2 ${done ? 'bg-red-500 border-red-500' : 'bg-white border-gray-200'}">
                ${done ? `<svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>` : `<span class="w-2 h-2 rounded-full bg-gray-300"></span>`}
              </div>
              <span class="text-xs ${active ? 'text-red-500 font-semibold' : done ? 'text-gray-600' : 'text-gray-300'} whitespace-nowrap">${step}</span>
            </div>
            ${i < steps.length - 1 ? `<div class="flex-1 h-0.5 mb-4 mx-1 ${i < stepIndex ? 'bg-red-500' : 'bg-gray-200'}"></div>` : ''}
          </div>
        `;
      }).join('')}
    </div>
  `;

  const itemsDetail = order.items && order.items.length > 0 ? `
    <div class="space-y-3">
      ${order.items.map(item => `
        <div class="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
          <div class="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
            ${item.image ? `<img src="${item.image}" class="w-10 h-10 object-contain rounded" />` : `<svg class="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>`}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-800 truncate">${item.name}</p>
            <p class="text-xs text-gray-400 mt-0.5">Qty: ${item.qty}</p>
          </div>
          <p class="text-sm font-semibold text-gray-800 flex-shrink-0">$${(item.price * item.qty).toFixed(2)}</p>
        </div>
      `).join('')}
    </div>
  ` : '<p class="text-sm text-gray-400">No item details available.</p>';

  const shipping = amount > 50 ? 0 : 5.99;

  return `
    <div class="border border-gray-100 rounded-2xl shadow-sm overflow-hidden mb-4 bg-white hover:shadow-md transition-shadow">
      <!-- Card Header -->
      <button onclick="document.getElementById('${cardId}').classList.toggle('hidden')" class="w-full text-left">
        <div class="px-6 py-5 flex items-center gap-4">
          <!-- Order icon -->
          <div class="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
          </div>
          <!-- Info -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-xs text-gray-400 font-medium uppercase tracking-wide">Order</span>
              <span class="font-mono text-sm font-bold text-gray-800">#${displayId}</span>
              <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cfg.color}">${status}</span>
            </div>
            <div class="flex items-center gap-4 mt-1">
              <span class="text-xs text-gray-400">${date}</span>
              <span class="text-xs text-gray-400">${itemCount} item${itemCount !== 1 ? 's' : ''}</span>
            </div>
          </div>
          <!-- Total + chevron -->
          <div class="flex items-center gap-4 flex-shrink-0">
            <span class="text-base font-bold text-gray-900">$${typeof amount === 'number' ? amount.toFixed(2) : amount}</span>
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
          </div>
        </div>
      </button>

      <!-- Expanded Detail -->
      <div id="${cardId}" class="hidden border-t border-gray-100">
        <!-- Status Tracker -->
        <div class="px-6 py-5 bg-gray-50 border-b border-gray-100">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Order Status</p>
          ${tracker}
        </div>

        <!-- Items -->
        <div class="px-6 py-5 border-b border-gray-100">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Items Ordered</p>
          ${itemsDetail}
        </div>

        <!-- Summary -->
        <div class="px-6 py-5 bg-gray-50">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Order Summary</p>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between text-gray-500">
              <span>Subtotal</span>
              <span>$${(amount - shipping).toFixed(2)}</span>
            </div>
            <div class="flex justify-between text-gray-500">
              <span>Shipping</span>
              <span>${shipping === 0 ? '<span class="text-green-500">Free</span>' : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div class="flex justify-between font-bold text-gray-900 border-t border-gray-200 pt-2 mt-2">
              <span>Total</span>
              <span>$${typeof amount === 'number' ? amount.toFixed(2) : amount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
