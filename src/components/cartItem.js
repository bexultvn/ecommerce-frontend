export function cartItemHTML(item) {
  return `
    <div class="flex gap-4 py-4 border-b border-gray-200" data-product-id="${item.productId}">
      <img
        src="${item.image}"
        alt="${item.name}"
        class="w-20 h-20 object-cover rounded bg-gray-100 flex-shrink-0"
      />
      <div class="flex-1 min-w-0">
        <h3 class="font-medium text-gray-900 truncate">${item.name}</h3>
        <p class="text-sm text-gray-500 mt-0.5">$${item.price.toFixed(2)} each</p>
        <div class="flex items-center gap-2 mt-2">
          <button
            class="w-7 h-7 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 font-bold"
            data-action="decrease-qty"
            data-product-id="${item.productId}"
          >−</button>
          <span class="w-8 text-center font-medium">${item.qty}</span>
          <button
            class="w-7 h-7 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 font-bold"
            data-action="increase-qty"
            data-product-id="${item.productId}"
          >+</button>
        </div>
      </div>
      <div class="flex flex-col items-end justify-between flex-shrink-0">
        <button
          class="text-gray-400 hover:text-red-500 text-lg leading-none"
          data-action="remove-item"
          data-product-id="${item.productId}"
          title="Remove"
        >&#10005;</button>
        <span class="font-bold text-gray-900">$${(item.price * item.qty).toFixed(2)}</span>
      </div>
    </div>
  `;
}
