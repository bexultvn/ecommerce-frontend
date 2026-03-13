import { getUser, isLoggedIn } from '../core/auth.js';
import { eventBus } from '../core/eventBus.js';
import { getCount } from '../services/cartService.js';
import { logout } from '../services/authService.js';
import { navigate } from '../core/router.js';

function getNavbarHTML() {
  const loggedIn = isLoggedIn();
  const user = getUser();
  const cartCount = getCount();

  const authLinks = loggedIn
    ? `
      <a href="#/orders" class="text-sm font-medium hover:text-gray-600">Orders</a>
      <a href="#/profile" class="text-sm font-medium hover:text-gray-600">Profile</a>
      <span class="text-sm text-gray-500">Hi, ${user.firstName || user.email}</span>
      <button id="logout-btn" class="text-sm font-medium text-red-600 hover:text-red-800">Logout</button>
    `
    : `<a href="#/login" class="text-sm font-medium hover:text-gray-600">Login</a>`;

  const cartLink = loggedIn
    ? `
      <a href="#/cart" class="relative text-sm font-medium hover:text-gray-600">
        Cart
        ${cartCount > 0 ? `<span id="cart-count" class="absolute -top-2 -right-4 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">${cartCount}</span>` : `<span id="cart-count" class="hidden"></span>`}
      </a>
    `
    : '';

  return `
    <nav class="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div class="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <a href="#/" class="text-xl font-bold tracking-tight">ShopApp</a>
        <div class="flex items-center gap-6">
          <a href="#/" class="text-sm font-medium hover:text-gray-600">Home</a>
          <a href="#/products" class="text-sm font-medium hover:text-gray-600">Products</a>
          ${cartLink}
          ${authLinks}
        </div>
      </div>
    </nav>
  `;
}

function updateCartBadge(cart) {
  const count = cart ? cart.reduce((s, i) => s + i.qty, 0) : getCount();
  const badge = document.getElementById('cart-count');
  if (!badge) return;
  if (count > 0) {
    badge.textContent = count;
    badge.classList.remove('hidden');
  } else {
    badge.classList.add('hidden');
  }
}

export function renderNavbar() {
  const container = document.getElementById('navbar-container');
  if (!container) return;

  container.innerHTML = getNavbarHTML();

  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      logout();
      navigate('/');
    });
  }

  // Listen for auth changes to re-render navbar
  eventBus.on('auth:changed', () => {
    renderNavbar();
  });

  // Listen for cart updates to update badge
  eventBus.on('cart:updated', (cart) => {
    updateCartBadge(cart);
  });
}
