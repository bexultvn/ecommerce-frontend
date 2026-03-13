export function productCard(product) {
  const imageHTML = product.image
    ? `<img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover bg-gray-100" />`
    : `<div class="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">No image</div>`;

  return `
    <div class="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <a href="#/product/${product.id}" class="block">
        ${imageHTML}
      </a>
      <div class="p-4">
        <span class="text-xs text-gray-500 uppercase tracking-wide">${product.categoryName || ''}</span>
        <a href="#/product/${product.id}" class="block mt-1">
          <h3 class="font-semibold text-gray-900 hover:text-gray-600 line-clamp-2">${product.name}</h3>
        </a>
        <div class="flex items-center justify-between mt-3">
          <span class="text-lg font-bold">$${Number(product.price).toFixed(2)}</span>
          <button
            class="bg-black text-white text-sm px-3 py-1.5 rounded hover:bg-gray-800"
            data-action="add-to-cart"
            data-product-id="${product.id}"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  `;
}
