export function productCard(product) {
  return `
    <div class="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <a href="#/product/${product.id}" class="block">
        <img
          src="${product.image}"
          alt="${product.name}"
          class="w-full h-48 object-cover bg-gray-100"
        />
      </a>
      <div class="p-4">
        <span class="text-xs text-gray-500 uppercase tracking-wide">${product.category}</span>
        <a href="#/product/${product.id}" class="block mt-1">
          <h3 class="font-semibold text-gray-900 hover:text-gray-600 line-clamp-2">${product.name}</h3>
        </a>
        <div class="flex items-center gap-1 mt-1">
          <span class="text-yellow-500 text-sm">&#9733;</span>
          <span class="text-sm text-gray-600">${product.rating}</span>
        </div>
        <div class="flex items-center justify-between mt-3">
          <span class="text-lg font-bold">$${product.price.toFixed(2)}</span>
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
