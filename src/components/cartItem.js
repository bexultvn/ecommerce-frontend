export function cartItemHTML(item) {
  const imageHTML = item.image
    ? `<img src="${item.image}" alt="${item.name}" class="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-105" />`
    : `<div class="w-full h-full flex items-center justify-center text-gray-300">
         <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
       </div>`;

  return `
    <div class="group flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-200" data-product-id="${item.productId}">

      <!-- Image -->
      <a href="#/product/${item.productId}" class="w-20 h-20 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden block">
        ${imageHTML}
      </a>

      <!-- Info -->
      <div class="flex-1 min-w-0">
        <a href="#/product/${item.productId}" class="text-sm font-semibold text-gray-900 hover:text-red-500 transition-colors line-clamp-2 block leading-snug">${item.name}</a>
        <p class="text-xs text-gray-400 mt-1">$${item.price.toFixed(2)} each</p>
      </div>

      <!-- Qty Controls -->
      <div class="flex items-center rounded-xl border border-gray-200 overflow-hidden flex-shrink-0">
        <button class="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors text-lg select-none"
                data-action="decrease-qty" data-product-id="${item.productId}" aria-label="Decrease">−</button>
        <span class="w-10 text-center text-sm font-semibold text-gray-800 select-none">${item.qty}</span>
        <button class="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors text-lg select-none"
                data-action="increase-qty" data-product-id="${item.productId}" aria-label="Increase">+</button>
      </div>

      <!-- Subtotal -->
      <div class="w-20 text-right flex-shrink-0">
        <p class="font-bold text-gray-900 text-sm">$${(item.price * item.qty).toFixed(2)}</p>
      </div>

      <!-- Remove -->
      <button class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all duration-200 opacity-0 group-hover:opacity-100"
              data-action="remove-item" data-product-id="${item.productId}" title="Remove item" aria-label="Remove">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" pointer-events="none">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
        </svg>
      </button>
    </div>
  `;
}
