import { getUser, isLoggedIn } from '../core/auth.js';
import { eventBus } from '../core/eventBus.js';
import { getCount as getCartCount } from '../services/cartService.js';
import { getCount as getWishlistCount } from '../services/wishlistService.js';
import { logout } from '../services/authService.js';
import { navigate } from '../core/router.js';

function getNavbarHTML() {
  const loggedIn = isLoggedIn();
  const user = getUser();
  const cartCount = getCartCount();
  const wishlistCount = getWishlistCount();
  const displayName = user ? (user.firstName || user.email || 'Account') : '';
  const currentHash = window.location.hash || '#/';

  const navLink = (href, label) => {
    const isActive = currentHash === href || (href !== '#/' && currentHash.startsWith(href));
    return `<a href="${href}" class="text-sm font-medium transition-colors ${isActive ? 'text-red-500 border-b-2 border-red-500 pb-0.5' : 'hover:text-gray-500'}">${label}</a>`;
  };

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
          <a href="#/wishlist" class="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
            My Wishlist
            ${wishlistCount > 0 ? `<span class="ml-auto bg-red-100 text-red-500 text-xs font-bold px-1.5 py-0.5 rounded-full">${wishlistCount}</span>` : ''}
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
<nav class="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
        <a href="#/" class="flex items-center gap-2.5 flex-shrink-0 group">
          <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="34" height="34" rx="9" fill="#ef4444"/>
            <path d="M11 15V12.5a6 6 0 0112 0V15" stroke="white" stroke-width="2.2" stroke-linecap="round" fill="none"/>
            <rect x="7" y="15" width="20" height="13" rx="3" fill="white"/>
            <path d="M20 21.5c0-.9-.9-1.5-3-1.5s-3 .6-3 1.5.9 1.1 3 1.6c2.1.5 3 .7 3 1.6s-.9 1.3-3 1.3-3-.7-3-1.5" stroke="#ef4444" stroke-width="1.6" stroke-linecap="round"/>
          </svg>
          <span class="text-xl font-bold tracking-tight text-gray-900">Shop<span class="text-red-500">ify</span></span>
        </a>

        <div class="hidden md:flex items-center gap-8">
          ${navLink('#/', 'Home')}
          ${navLink('#/products', 'Products')}
        </div>

        <div class="flex items-center gap-4 flex-shrink-0">
          ${loggedIn ? `
          <a href="#/orders"
             class="relative transition-colors ${currentHash.startsWith('#/orders') ? 'text-red-500' : 'text-gray-700 hover:text-red-500'}"
             title="My Orders">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>
          </a>` : ''}

          <!-- Wishlist -->
          <a href="#/wishlist"
             class="relative transition-colors ${currentHash.startsWith('#/wishlist') ? 'text-red-500' : 'text-gray-700 hover:text-red-500'}"
             title="Wishlist">
            <svg class="w-6 h-6" fill="${wishlistCount > 0 ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24"
                 style="${wishlistCount > 0 ? 'color:#ef4444;' : ''}">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
            <span id="wishlist-count" class="${wishlistCount > 0 ? '' : 'hidden'} absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center leading-none">${wishlistCount}</span>
          </a>

          <!-- Cart -->
          <a href="#/cart"
             class="relative transition-colors ${currentHash.startsWith('#/cart') ? 'text-red-500' : 'text-gray-700 hover:text-red-500'}"
             title="Cart">
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
  const count = cart ? cart.reduce((s, i) => s + i.qty, 0) : getCartCount();
  const badge = document.getElementById('cart-count');
  if (!badge) return;
  if (count > 0) {
    badge.textContent = count;
    badge.classList.remove('hidden');
  } else {
    badge.classList.add('hidden');
  }
}

function updateWishlistBadge(list) {
  const count = Array.isArray(list) ? list.length : getWishlistCount();
  const badge = document.getElementById('wishlist-count');
  if (!badge) return;
  if (count > 0) {
    badge.textContent = count;
    badge.classList.remove('hidden');
    // fill the heart icon
    const heartSvg = badge.closest('a')?.querySelector('svg');
    if (heartSvg) {
      heartSvg.setAttribute('fill', 'currentColor');
      heartSvg.style.color = '#ef4444';
    }
  } else {
    badge.classList.add('hidden');
    const heartSvg = badge.closest('a')?.querySelector('svg');
    if (heartSvg) {
      heartSvg.setAttribute('fill', 'none');
      heartSvg.style.color = '';
    }
  }
}

function attachNavbarEvents() {
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      logout();
      navigate('/');
    });
  }
}

let navbarEventsRegistered = false;

export function renderNavbar() {
  const container = document.getElementById('navbar-container');
  if (!container) return;

  container.innerHTML = getNavbarHTML();
  attachNavbarEvents();

  if (!navbarEventsRegistered) {
    navbarEventsRegistered = true;
    eventBus.on('auth:changed', () => renderNavbar());
    eventBus.on('cart:updated', (cart) => updateCartBadge(cart));
    eventBus.on('wishlist:updated', (list) => updateWishlistBadge(list));
  }
}
