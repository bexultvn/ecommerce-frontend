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

  const isActive = (href) => currentHash === href || (href !== '#/' && currentHash.startsWith(href));

  const navLink = (href, label) => `
    <a href="${href}" class="text-sm font-medium transition-colors ${isActive(href)
      ? 'text-red-500'
      : 'text-gray-600 hover:text-gray-900'}">${label}</a>`;

  const mobileNavLink = (href, label) => `
    <a href="${href}"
       class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive(href)
         ? 'bg-red-50 text-red-500'
         : 'text-gray-700 hover:bg-gray-50'}">${label}</a>`;

  const userSection = loggedIn
    ? `
      <div class="relative group">
        <button class="w-8 h-8 rounded-full bg-gradient-to-br from-red-400 to-red-600 text-white flex items-center justify-center text-sm font-bold focus:outline-none shadow-sm">
          ${displayName.charAt(0).toUpperCase()}
        </button>
        <div class="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 py-1.5 overflow-hidden"
             style="transform-origin:top right;">
          <div class="px-4 py-2.5 border-b border-gray-100 mb-1">
            <p class="text-xs font-semibold text-gray-900 truncate">${displayName}</p>
            <p class="text-xs text-gray-400 truncate">${user?.email || ''}</p>
          </div>
          <a href="#/profile" class="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            My Account
          </a>
          <a href="#/orders" class="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
            My Orders
          </a>
          <a href="#/wishlist" class="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
            My Wishlist
            ${wishlistCount > 0 ? `<span class="ml-auto bg-red-100 text-red-500 text-xs font-bold px-1.5 py-0.5 rounded-full">${wishlistCount}</span>` : ''}
          </a>
          <div class="border-t border-gray-100 my-1"></div>
          <button id="logout-btn" class="flex items-center gap-2.5 w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
            Logout
          </button>
        </div>
      </div>`
    : `
      <a href="#/login" class="flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-red-500 transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
        Sign In
      </a>`;

  return `
    <nav class="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-30">
      <!-- Main bar -->
      <div class="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between gap-4">

        <!-- Logo -->
        <a href="#/" class="flex items-center gap-2.5 flex-shrink-0">
          <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
            <rect width="34" height="34" rx="9" fill="#ef4444"/>
            <path d="M11 15V12.5a6 6 0 0112 0V15" stroke="white" stroke-width="2.2" stroke-linecap="round" fill="none"/>
            <rect x="7" y="15" width="20" height="13" rx="3" fill="white"/>
            <path d="M20 21.5c0-.9-.9-1.5-3-1.5s-3 .6-3 1.5.9 1.1 3 1.6c2.1.5 3 .7 3 1.6s-.9 1.3-3 1.3-3-.7-3-1.5" stroke="#ef4444" stroke-width="1.6" stroke-linecap="round"/>
          </svg>
          <span class="text-xl font-bold tracking-tight text-gray-900">Shop<span class="text-red-500">ify</span></span>
        </a>

        <!-- Desktop Nav -->
        <div class="hidden md:flex items-center gap-8">
          ${navLink('#/', 'Home')}
          ${navLink('#/products', 'Products')}
        </div>

        <!-- Right icons -->
        <div class="flex items-center gap-3 flex-shrink-0">
          ${loggedIn ? `
          <a href="#/orders"
             class="hidden md:flex relative text-gray-600 hover:text-red-500 transition-colors ${isActive('#/orders') ? 'text-red-500' : ''}"
             title="My Orders">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>
          </a>` : ''}

          <!-- Wishlist -->
          <a href="#/wishlist"
             class="relative text-gray-600 hover:text-red-500 transition-colors ${isActive('#/wishlist') ? 'text-red-500' : ''}"
             title="Wishlist">
            <svg class="w-5 h-5" fill="${wishlistCount > 0 ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24"
                 style="${wishlistCount > 0 ? 'color:#ef4444;' : ''}">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
            <span id="wishlist-count" class="${wishlistCount > 0 ? '' : 'hidden'} absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold leading-none">${wishlistCount}</span>
          </a>

          <!-- Cart -->
          <a href="#/cart"
             class="relative text-gray-600 hover:text-red-500 transition-colors ${isActive('#/cart') ? 'text-red-500' : ''}"
             title="Cart">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
            <span id="cart-count" class="${cartCount > 0 ? '' : 'hidden'} absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold leading-none">${cartCount}</span>
          </a>

          <!-- User (desktop) -->
          <div class="hidden md:flex">
            ${userSection}
          </div>

          <!-- Hamburger (mobile) -->
          <button id="mobile-menu-btn" class="md:hidden flex items-center justify-center w-8 h-8 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors" aria-label="Menu">
            <svg id="hamburger-icon" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
            <svg id="close-icon" class="w-5 h-5 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div id="mobile-menu" class="hidden md:hidden fixed top-16 left-0 right-0 bg-white border-t border-gray-100 shadow-xl px-4 py-3 space-y-1 z-40">
        ${mobileNavLink('#/', 'Home')}
        ${mobileNavLink('#/products', 'Products')}
        ${loggedIn ? mobileNavLink('#/orders', 'My Orders') : ''}
        ${loggedIn ? mobileNavLink('#/profile', 'My Account') : ''}
        ${mobileNavLink('#/wishlist', 'Wishlist')}
        ${mobileNavLink('#/cart', 'Cart')}
        <div class="border-t border-gray-100 my-2 pt-2">
          ${loggedIn
            ? `<div class="flex items-center justify-between px-3 py-2">
                 <div>
                   <p class="text-sm font-semibold text-gray-900">${displayName}</p>
                   <p class="text-xs text-gray-400">${user?.email || ''}</p>
                 </div>
                 <button id="mobile-logout-btn" class="text-xs font-medium text-red-500 hover:text-red-600 transition-colors px-3 py-1.5 rounded-lg border border-red-100 hover:bg-red-50">Logout</button>
               </div>`
            : `<a href="#/login" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors">Sign In / Register</a>`
          }
        </div>
      </div>
    </nav>
  `;
}

function updateCartBadge(cart) {
  const count = cart ? cart.reduce((s, i) => s + i.qty, 0) : getCartCount();
  const badge = document.getElementById('cart-count');
  if (!badge) return;
  badge.textContent = count;
  count > 0 ? badge.classList.remove('hidden') : badge.classList.add('hidden');
}

function updateWishlistBadge(list) {
  const count = Array.isArray(list) ? list.length : getWishlistCount();
  const badge = document.getElementById('wishlist-count');
  if (!badge) return;
  badge.textContent = count;
  if (count > 0) {
    badge.classList.remove('hidden');
    const heartSvg = badge.closest('a')?.querySelector('svg');
    if (heartSvg) { heartSvg.setAttribute('fill', 'currentColor'); heartSvg.style.color = '#ef4444'; }
  } else {
    badge.classList.add('hidden');
    const heartSvg = badge.closest('a')?.querySelector('svg');
    if (heartSvg) { heartSvg.setAttribute('fill', 'none'); heartSvg.style.color = ''; }
  }
}

function attachNavbarEvents() {
  // Logout (desktop)
  document.getElementById('logout-btn')?.addEventListener('click', () => { logout(); navigate('/'); });
  // Logout (mobile)
  document.getElementById('mobile-logout-btn')?.addEventListener('click', () => { logout(); navigate('/'); });

  // Mobile menu toggle
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  const hamburger = document.getElementById('hamburger-icon');
  const closeIcon = document.getElementById('close-icon');
  if (btn && menu) {
    btn.addEventListener('click', () => {
      const open = menu.classList.toggle('hidden');
      hamburger?.classList.toggle('hidden', !open);
      closeIcon?.classList.toggle('hidden', open);
    });
  }

  // Close mobile menu on link click
  menu?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.add('hidden');
      hamburger?.classList.remove('hidden');
      closeIcon?.classList.add('hidden');
    });
  });
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
