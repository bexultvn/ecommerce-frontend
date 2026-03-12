import { getCurrentUser } from '../services/authService.js';
import { updateUser, changePassword } from '../services/userService.js';
import { showToast } from '../components/toast.js';
import { lsGetAll } from '../storage/localStorage.js';

export const template = `
  <div class="max-w-2xl mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-8">My Profile</h1>

    <!-- Profile Info Form -->
    <div class="border border-gray-200 rounded-lg p-6 mb-6">
      <h2 class="text-lg font-semibold mb-5">Personal Information</h2>
      <form id="profile-form" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            id="profile-name"
            class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            id="profile-email"
            class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black bg-gray-50"
            readonly
          />
          <p class="text-xs text-gray-400 mt-1">Email cannot be changed</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            type="tel"
            id="profile-phone"
            class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="555-000-0000"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <textarea
            id="profile-address"
            rows="2"
            class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
            placeholder="123 Main St, City, State ZIP"
          ></textarea>
        </div>
        <button
          type="submit"
          class="bg-black text-white px-6 py-2 rounded font-semibold hover:bg-gray-800 text-sm"
        >
          Save Changes
        </button>
      </form>
    </div>

    <!-- Change Password -->
    <div class="border border-gray-200 rounded-lg p-6">
      <h2 class="text-lg font-semibold mb-5">Change Password</h2>
      <form id="password-form" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
          <input
            type="password"
            id="old-password"
            class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="••••••••"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <input
            type="password"
            id="new-password"
            class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="At least 6 characters"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
          <input
            type="password"
            id="confirm-password"
            class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Repeat new password"
          />
        </div>
        <button
          type="submit"
          class="bg-black text-white px-6 py-2 rounded font-semibold hover:bg-gray-800 text-sm"
        >
          Update Password
        </button>
      </form>
    </div>
  </div>
`;

export function init() {
  const user = getCurrentUser();
  if (!user) return;

  // Load full user data from storage (includes phone/address)
  const users = lsGetAll('users');
  const fullUser = users.find(u => u.id === user.id) || user;

  // Populate form
  document.getElementById('profile-name').value = fullUser.name || '';
  document.getElementById('profile-email').value = fullUser.email || '';
  document.getElementById('profile-phone').value = fullUser.phone || '';
  document.getElementById('profile-address').value = fullUser.address || '';

  // Save profile
  document.getElementById('profile-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('profile-name').value.trim();
    const phone = document.getElementById('profile-phone').value.trim();
    const address = document.getElementById('profile-address').value.trim();

    if (!name) {
      showToast('Name cannot be empty', 'error');
      return;
    }

    try {
      updateUser(user.id, { name, phone, address });
      showToast('Profile updated successfully', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  });

  // Change password
  document.getElementById('password-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const oldPass = document.getElementById('old-password').value;
    const newPass = document.getElementById('new-password').value;
    const confirmPass = document.getElementById('confirm-password').value;

    if (!oldPass) { showToast('Please enter your current password', 'error'); return; }
    if (!newPass) { showToast('Please enter a new password', 'error'); return; }
    if (newPass.length < 6) { showToast('New password must be at least 6 characters', 'error'); return; }
    if (newPass !== confirmPass) { showToast('Passwords do not match', 'error'); return; }

    try {
      changePassword(user.id, oldPass, newPass);
      showToast('Password updated successfully', 'success');
      document.getElementById('password-form').reset();
    } catch (err) {
      showToast(err.message, 'error');
    }
  });
}
