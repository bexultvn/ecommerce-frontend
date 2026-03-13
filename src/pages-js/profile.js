import { getCurrentUser } from '../services/authService.js';
import { updateUser, changePassword } from '../services/userService.js';
import { showToast } from '../components/toast.js';

export const template = `
  <div class="max-w-2xl mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-8">My Profile</h1>

    <!-- Profile Info Form -->
    <div class="border border-gray-200 rounded-lg p-6 mb-6">
      <h2 class="text-lg font-semibold mb-5">Personal Information</h2>
      <form id="profile-form" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              type="text"
              id="profile-firstname"
              class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="John"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              type="text"
              id="profile-lastname"
              class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Doe"
            />
          </div>
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

        <h3 class="text-sm font-semibold text-gray-700 pt-2">Address</h3>
        <div class="grid grid-cols-2 gap-4">
          <div class="col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Street</label>
            <input
              type="text"
              id="profile-street"
              class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Main St"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">House Number</label>
            <input
              type="text"
              id="profile-housenumber"
              class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="123"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
            <input
              type="text"
              id="profile-zipcode"
              class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="10001"
            />
          </div>
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

export async function init() {
  const user = getCurrentUser();
  if (!user) return;

  const addr = user.address || {};
  document.getElementById('profile-firstname').value = user.firstName || '';
  document.getElementById('profile-lastname').value = user.lastName || '';
  document.getElementById('profile-email').value = user.email || '';
  document.getElementById('profile-street').value = addr.street || '';
  document.getElementById('profile-housenumber').value = addr.houseNumber || '';
  document.getElementById('profile-zipcode').value = addr.zipCode || '';

  // Save profile
  document.getElementById('profile-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const firstName = document.getElementById('profile-firstname').value.trim();
    const lastName = document.getElementById('profile-lastname').value.trim();
    const address = {
      street: document.getElementById('profile-street').value.trim(),
      houseNumber: document.getElementById('profile-housenumber').value.trim(),
      zipCode: document.getElementById('profile-zipcode').value.trim()
    };

    if (!firstName) { showToast('First name cannot be empty', 'error'); return; }
    if (!lastName) { showToast('Last name cannot be empty', 'error'); return; }

    try {
      await updateUser(user.id, { firstName, lastName, address });
      showToast('Profile updated successfully', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  });

  // Change password (mock only)
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
