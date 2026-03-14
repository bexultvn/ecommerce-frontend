export function cartItemHTML(item) {
  const imageHTML = item.image
    ? `<img src="${item.image}" alt="${item.name}" class="w-14 h-14 object-contain bg-gray-100 rounded" />`
    : `<div class="w-14 h-14 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">No img</div>`;

  return `
    <tr class="border-b border-gray-200" data-product-id="${item.productId}">
      <td class="py-5 pr-4">
        <div class="flex items-center gap-4">
          <button class="text-gray-400 hover:text-red-500 text-lg font-bold leading-none" data-action="remove-item" data-product-id="${item.productId}" title="Remove">&#10005;</button>
          ${imageHTML}
          <span class="text-sm font-medium text-gray-800">${item.name}</span>
        </div>
      </td>
      <td class="py-5 pr-4 text-sm text-gray-700">$${item.price.toFixed(2)}</td>
      <td class="py-5 pr-4">
        <div class="flex items-center border border-gray-300 rounded w-24">
          <button class="w-8 h-10 flex items-center justify-center hover:bg-gray-100 text-gray-600" data-action="decrease-qty" data-product-id="${item.productId}">−</button>
          <span class="flex-1 text-center text-sm font-medium">${String(item.qty).padStart(2, '0')}</span>
          <button class="w-8 h-10 flex items-center justify-center hover:bg-gray-100 text-gray-600" data-action="increase-qty" data-product-id="${item.productId}">+</button>
        </div>
      </td>
      <td class="py-5 text-sm font-medium text-gray-800">$${(item.price * item.qty).toFixed(2)}</td>
    </tr>
  `;
}
