import { login, register } from '../services/authService.js';
import { navigate } from '../core/router.js';
import { showToast } from '../components/toast.js';

export const template = `
  <div class="flex min-h-[calc(100vh-12rem)]">
    <div class="hidden md:flex w-1/2 bg-black items-center justify-center relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-red-950 opacity-90"></div>
      <div class="relative z-10 text-center p-12 flex flex-col items-center gap-8">
        <!-- Shopping bag icon -->
        <div class="w-24 h-24 rounded-full bg-red-500 bg-opacity-20 flex items-center justify-center mb-2">
          <svg class="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
          </svg>
        </div>
        <!-- Product grid illustration -->
        <div class="grid grid-cols-3 gap-3">
          <div class="bg-gray-800 bg-opacity-80 rounded-xl p-3 flex flex-col items-center gap-2 border border-gray-700">
            <svg class="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
            <span class="text-gray-400 text-xs">Phones</span>
          </div>
          <div class="bg-gray-800 bg-opacity-80 rounded-xl p-3 flex flex-col items-center gap-2 border border-gray-700">
            <svg class="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            <span class="text-gray-400 text-xs">Laptops</span>
          </div>
          <div class="bg-gray-800 bg-opacity-80 rounded-xl p-3 flex flex-col items-center gap-2 border border-gray-700">
            <svg class="w-7 h-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/></svg>
            <span class="text-gray-400 text-xs">Audio</span>
          </div>
          <div class="bg-gray-800 bg-opacity-80 rounded-xl p-3 flex flex-col items-center gap-2 border border-gray-700">
            <svg class="w-7 h-7 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            <span class="text-gray-400 text-xs">Cameras</span>
          </div>
          <div class="bg-gray-800 bg-opacity-80 rounded-xl p-3 flex flex-col items-center gap-2 border border-gray-700">
            <svg class="w-7 h-7 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <span class="text-gray-400 text-xs">Watches</span>
          </div>
          <div class="bg-gray-800 bg-opacity-80 rounded-xl p-3 flex flex-col items-center gap-2 border border-gray-700">
            <svg class="w-7 h-7 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"/></svg>
            <span class="text-gray-400 text-xs">Gaming</span>
          </div>
        </div>
        <div>
          <p class="text-white text-lg font-semibold">Welcome to ShopApp</p>
          <p class="text-gray-400 text-sm mt-1">Your one-stop shop for everything</p>
        </div>
      </div>
    </div>
    <div class="w-full md:w-1/2 flex items-center justify-center px-5 sm:px-8 py-10 sm:py-12">
      <div class="w-full max-w-sm">
        <div id="login-panel">
          <h1 class="text-2xl sm:text-3xl font-semibold mb-2">Log in to ShopApp</h1>
          <p class="text-gray-500 text-sm mb-8">Enter your details below</p>
          <form id="login-form" class="space-y-7">
            <div class="border-b border-gray-300 pb-1 focus-within:border-red-500 transition-colors">
              <input type="email" id="login-email" class="w-full text-sm outline-none bg-transparent placeholder-gray-400 py-1" placeholder="Email or Phone Number" />
            </div>
            <div class="border-b border-gray-300 pb-1 focus-within:border-red-500 transition-colors">
              <input type="password" id="login-password" class="w-full text-sm outline-none bg-transparent placeholder-gray-400 py-1" placeholder="Password" />
            </div>
            <div class="flex items-center justify-between pt-1">
              <button type="submit" class="bg-red-500 hover:bg-red-600 text-white px-10 py-3 rounded text-sm font-medium transition-colors">Log In</button>
              <button type="button" id="forgot-link" class="text-red-500 text-sm hover:underline">Forget Password?</button>
            </div>
            <p class="text-sm text-center text-gray-500 pt-1">
              Don't have an account?
              <button type="button" id="go-register" class="font-semibold underline hover:text-black ml-1">Create Account</button>
            </p>
          </form>
        </div>
        <div id="register-panel" class="hidden">
          <h1 class="text-2xl sm:text-3xl font-semibold mb-2">Create an account</h1>
          <p class="text-gray-500 text-sm mb-8">Enter your details below</p>
          <form id="register-form" class="space-y-6">
            <div class="grid grid-cols-2 gap-4">
              <div class="border-b border-gray-300 pb-1 focus-within:border-red-500 transition-colors">
                <input type="text" id="reg-firstname" class="w-full text-sm outline-none bg-transparent placeholder-gray-400 py-1" placeholder="First Name" />
              </div>
              <div class="border-b border-gray-300 pb-1 focus-within:border-red-500 transition-colors">
                <input type="text" id="reg-lastname" class="w-full text-sm outline-none bg-transparent placeholder-gray-400 py-1" placeholder="Last Name" />
              </div>
            </div>
            <div class="border-b border-gray-300 pb-1 focus-within:border-red-500 transition-colors">
              <input type="email" id="reg-email" class="w-full text-sm outline-none bg-transparent placeholder-gray-400 py-1" placeholder="Email or Phone Number" />
            </div>
            <div class="border-b border-gray-300 pb-1 focus-within:border-red-500 transition-colors">
              <input type="password" id="reg-password" class="w-full text-sm outline-none bg-transparent placeholder-gray-400 py-1" placeholder="Password" />
            </div>
            <div class="border-b border-gray-300 pb-1 focus-within:border-red-500 transition-colors">
              <input type="password" id="reg-confirm" class="w-full text-sm outline-none bg-transparent placeholder-gray-400 py-1" placeholder="Confirm Password" />
            </div>
            <button type="submit" class="w-full bg-red-500 hover:bg-red-600 text-white py-3.5 rounded text-sm font-medium transition-colors">Create Account</button>
            <p class="text-sm text-center text-gray-500">
              Already have an account?
              <button type="button" id="go-login" class="font-semibold underline hover:text-black ml-1">Log in</button>
            </p>
          </form>
        </div>
      </div>
    </div>
  </div>
`;

export function init() {
  const loginPanel = document.getElementById('login-panel');
  const registerPanel = document.getElementById('register-panel');
  document.getElementById('go-register').addEventListener('click', () => {
    loginPanel.classList.add('hidden');
    registerPanel.classList.remove('hidden');
  });
  document.getElementById('go-login').addEventListener('click', () => {
    registerPanel.classList.add('hidden');
    loginPanel.classList.remove('hidden');
  });
  document.getElementById('forgot-link').addEventListener('click', () => {
    showToast('Password reset not available in demo mode', 'info');
  });
  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    if (!email) { showToast('Please enter your email', 'error'); return; }
    if (!password) { showToast('Please enter your password', 'error'); return; }
    try {
      await login(email, password);
      showToast('Welcome back!', 'success');
      navigate('/');
    } catch (err) {
      showToast(err.message, 'error');
    }
  });
  document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const firstName = document.getElementById('reg-firstname').value.trim();
    const lastName = document.getElementById('reg-lastname').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const confirm = document.getElementById('reg-confirm').value;
    if (!firstName) { showToast('Please enter your first name', 'error'); return; }
    if (!lastName) { showToast('Please enter your last name', 'error'); return; }
    if (!email || !email.includes('@')) { showToast('Please enter a valid email', 'error'); return; }
    if (!password || password.length < 6) { showToast('Password must be at least 6 characters', 'error'); return; }
    if (password !== confirm) { showToast('Passwords do not match', 'error'); return; }
    try {
      await register({ firstName, lastName, email, password });
      showToast('Account created! Welcome!', 'success');
      navigate('/');
    } catch (err) {
      showToast(err.message, 'error');
    }
  });
}
