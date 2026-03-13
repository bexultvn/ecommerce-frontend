import { login, register } from '../services/authService.js';
import { navigate } from '../core/router.js';
import { showToast } from '../components/toast.js';

export const template = `
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-lg shadow-md w-full max-w-md p-8">
      <h1 class="text-2xl font-bold text-center mb-6">Welcome to ShopApp</h1>

      <!-- Tabs -->
      <div class="flex border-b border-gray-200 mb-6">
        <button
          id="tab-login"
          class="flex-1 py-2 text-sm font-semibold border-b-2 border-black text-black"
          data-tab="login"
        >Login</button>
        <button
          id="tab-register"
          class="flex-1 py-2 text-sm font-semibold border-b-2 border-transparent text-gray-500 hover:text-gray-700"
          data-tab="register"
        >Register</button>
      </div>

      <!-- Login Form -->
      <form id="login-form" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            id="login-email"
            class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            id="login-password"
            class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          class="w-full bg-black text-white py-2 rounded font-semibold hover:bg-gray-800 text-sm"
        >
          Login
        </button>
        <p class="text-xs text-gray-500 text-center">Demo: john@example.com / password123</p>
      </form>

      <!-- Register Form -->
      <form id="register-form" class="space-y-4 hidden">
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              type="text"
              id="reg-firstname"
              class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="John"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              type="text"
              id="reg-lastname"
              class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Doe"
            />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            id="reg-email"
            class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            id="reg-password"
            class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="At least 6 characters"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
          <input
            type="password"
            id="reg-confirm"
            class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Repeat password"
          />
        </div>
        <button
          type="submit"
          class="w-full bg-black text-white py-2 rounded font-semibold hover:bg-gray-800 text-sm"
        >
          Create Account
        </button>
      </form>
    </div>
  </div>
`;

export function init() {
  const tabLogin = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');

  function showTab(tab) {
    if (tab === 'login') {
      loginForm.classList.remove('hidden');
      registerForm.classList.add('hidden');
      tabLogin.classList.add('border-black', 'text-black');
      tabLogin.classList.remove('border-transparent', 'text-gray-500');
      tabRegister.classList.remove('border-black', 'text-black');
      tabRegister.classList.add('border-transparent', 'text-gray-500');
    } else {
      registerForm.classList.remove('hidden');
      loginForm.classList.add('hidden');
      tabRegister.classList.add('border-black', 'text-black');
      tabRegister.classList.remove('border-transparent', 'text-gray-500');
      tabLogin.classList.remove('border-black', 'text-black');
      tabLogin.classList.add('border-transparent', 'text-gray-500');
    }
  }

  tabLogin.addEventListener('click', () => showTab('login'));
  tabRegister.addEventListener('click', () => showTab('register'));

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    if (!email) { showToast('Please enter your email', 'error'); return; }
    if (!password) { showToast('Please enter your password', 'error'); return; }

    try {
      login(email, password);
      showToast('Welcome back!', 'success');
      navigate('/');
    } catch (err) {
      showToast(err.message, 'error');
    }
  });

  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const firstName = document.getElementById('reg-firstname').value.trim();
    const lastName = document.getElementById('reg-lastname').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const confirm = document.getElementById('reg-confirm').value;

    if (!firstName) { showToast('Please enter your first name', 'error'); return; }
    if (!lastName) { showToast('Please enter your last name', 'error'); return; }
    if (!email) { showToast('Please enter your email', 'error'); return; }
    if (!email.includes('@')) { showToast('Please enter a valid email', 'error'); return; }
    if (!password) { showToast('Please enter a password', 'error'); return; }
    if (password.length < 6) { showToast('Password must be at least 6 characters', 'error'); return; }
    if (password !== confirm) { showToast('Passwords do not match', 'error'); return; }

    try {
      register({ firstName, lastName, email, password });
      showToast('Account created! Welcome!', 'success');
      navigate('/');
    } catch (err) {
      showToast(err.message, 'error');
    }
  });
}
