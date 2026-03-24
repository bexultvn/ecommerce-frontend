export function renderFooter() {
  const container = document.getElementById('footer-container');
  if (!container) return;

  container.innerHTML = `
    <footer class="bg-black text-white mt-16">
      <div class="max-w-7xl mx-auto px-6 py-16">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          <!-- Brand + Subscribe -->
          <div class="lg:col-span-1">
            <div class="flex items-center gap-2 mb-4">
              <svg width="28" height="28" viewBox="0 0 34 34" fill="none">
                <rect width="34" height="34" rx="9" fill="#ef4444"/>
                <path d="M11 15V12.5a6 6 0 0112 0V15" stroke="white" stroke-width="2.2" stroke-linecap="round" fill="none"/>
                <rect x="7" y="15" width="20" height="13" rx="3" fill="white"/>
                <path d="M20 21.5c0-.9-.9-1.5-3-1.5s-3 .6-3 1.5.9 1.1 3 1.6c2.1.5 3 .7 3 1.6s-.9 1.3-3 1.3-3-.7-3-1.5" stroke="#ef4444" stroke-width="1.6" stroke-linecap="round"/>
              </svg>
              <h3 class="text-xl font-bold">Shop<span class="text-red-400">ify</span></h3>
            </div>
            <p class="text-sm font-semibold mb-3">Subscribe</p>
            <p class="text-sm text-gray-400 mb-4">Get 10% off your first order</p>
            <form id="footer-subscribe-form" class="flex border border-gray-600 rounded overflow-hidden">
              <input
                type="email"
                id="footer-email"
                placeholder="Enter your email"
                class="flex-1 bg-transparent text-sm px-3 py-2 outline-none text-gray-300 placeholder-gray-500"
              />
              <button type="submit" class="px-3 py-2 text-gray-400 hover:text-white transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
              </button>
            </form>
          </div>

          <!-- Support -->
          <div>
            <h4 class="font-semibold mb-5">Support</h4>
            <div class="space-y-3 text-sm text-gray-400">
              <p>Almaty<br/>Abylay Khan 1/1, Kazakhstan.</p>
              <p>shopify@gmail.com</p>
              <p>8777-777-7777</p>
            </div>
          </div>

          <!-- Account -->
          <div>
            <h4 class="font-semibold mb-5">Account</h4>
            <ul class="space-y-3 text-sm text-gray-400">
              <li><a href="#/profile" class="hover:text-white transition-colors">My Account</a></li>
              <li><a href="#/login" class="hover:text-white transition-colors">Login / Register</a></li>
              <li><a href="#/cart" class="hover:text-white transition-colors">Cart</a></li>
              <li><a href="#/products" class="hover:text-white transition-colors">Shop</a></li>
            </ul>
          </div>

          <!-- Quick Link -->
          <div>
            <h4 class="font-semibold mb-5">Quick Link</h4>
            <ul class="space-y-3 text-sm text-gray-400">
              <li><a href="#/" class="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#/" class="hover:text-white transition-colors">Terms Of Use</a></li>
              <li><a href="#/" class="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#/" class="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

        </div>
      </div>

      <!-- Bottom bar -->
      <div class="border-t border-gray-800 py-5 text-center text-sm text-gray-500">
        &copy; Copyright Shopify ${new Date().getFullYear()}. All rights reserved
      </div>
    </footer>
  `;

  document.getElementById('footer-subscribe-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
  });
}
