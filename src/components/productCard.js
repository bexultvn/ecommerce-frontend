export function productCard(product) {
  const imageHTML = product.image
    ? `<img src="${product.image}" alt="${product.name}" class="w-full h-48 object-contain bg-gray-100 p-4" />`
    : `<div class="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">No image</div>`;

  return `
    <div class="group relative cursor-pointer">
      <div class="relative overflow-hidden rounded bg-gray-100 mb-3">
        <a href="#/product/${product.id}" class="block">
          ${imageHTML}
        </a>
        <!-- Add to cart overlay -->
        <button
          class="absolute bottom-0 left-0 right-0 bg-black text-white text-sm py-2.5 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          data-action="add-to-cart"
          data-product-id="${product.id}"
        >
          Add To Cart
        </button>
      </div>
      <a href="#/product/${product.id}" class="block">
        <h3 class="font-semibold text-sm text-gray-900 hover:text-gray-600 mb-1 line-clamp-2">${product.name}</h3>
      </a>
      <div class="flex items-center gap-2 mb-1">
        <span class="text-red-500 font-bold text-base">$${Number(product.price).toFixed(2)}</span>
      </div>
    </div>
  `;
}
