import { getUser, isLoggedIn } from '../core/auth.js';
import { eventBus } from '../core/eventBus.js';
import { getCount } from '../services/cartService.js';
import { logout } from '../services/authService.js';
import { navigate } from '../core/router.js';

function getNavbarHTML() {
  const loggedIn = isLoggedIn();
  const user = getUser();
  const cartCount = getCount();
  const displayName = user ? (user.firstName || user.email || 'Account') : '';

  const userSection = loggedIn
    ? `
      <div class="relative group">
        <button class="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center text-sm font-semibold focus:outline-none">
          ${displayName.charAt(0).toUpperCase()}
        </button>
        <div class="absolute right-0 top-full mt-1 w-44 bg-white border border-gray-100 rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
          <a href="#/profile" class="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            My Account
          </a>
          <a href="#/orders" class="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
            My Orders
          </a>
          <hr class="my-1" />
          <button id="logout-btn" class="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 text-red-500">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
            Logout
          </button>
        </div>
      </div>
    `
    : `
      <a href="#/login" class="flex items-center gap-1 text-sm font-medium hover:text-red-500 transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
        Sign In
      </a>
    `;

  return `
    <div class="bg-black text-white text-center py-2 px-4 text-sm">
      <span> Sale For All Products And Free Express Delivery - OFF 50%! &nbsp;</span>
      <a href="#/products" class="font-semibold underline hover:no-underline">ShopNow</a>
    </div>
    <nav class="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
        <a href="#/" class="text-xl font-bold tracking-tight flex-shrink-0">ShopApp</a>
        <div class="hidden md:flex items-center gap-8">
          <a href="#/" class="text-sm font-medium hover:text-gray-500 transition-colors">Home</a>
          <a href="#/products" class="text-sm font-medium hover:text-gray-500 transition-colors">Products</a>
          <a href="#/products" class="text-sm font-medium hover:text-gray-500 transition-colors">About</a>
          ${loggedIn
            ? `<a href="#/profile" class="text-sm font-medium hover:text-gray-500 transition-colors">Account</a>`
            : `<a href="#/login" class="text-sm font-medium hover:text-gray-500 transition-colors">Sign Up</a>`}
        </div>
        <div class="flex items-center gap-4 flex-shrink-0">
          <form id="navbar-search-form" class="hidden md:flex items-center border border-gray-300 rounded px-3 py-1.5 gap-2 w-52">
            <input id="navbar-search-input" type="text" placeholder="What are you looking for?" class="flex-1 text-xs outline-none bg-transparent" />
            <button type="submit" class="text-gray-500 hover:text-black">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </button>
          </form>
          <a href="#/cart" class="relative text-gray-700 hover:text-red-500 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
            <span id="cart-count" class="${cartCount > 0 ? '' : 'hidden'} absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center leading-none">${cartCount}</span>
          </a>
          ${userSection}
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

  const searchForm = document.getElementById('navbar-search-form');
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = document.getElementById('navbar-search-input').value.trim();
      if (q) navigate(`/products?search=${encodeURIComponent(q)}`);
    });
  }

  eventBus.on('auth:changed', () => renderNavbar());
  eventBus.on('cart:updated', (cart) => updateCartBadge(cart));
}
