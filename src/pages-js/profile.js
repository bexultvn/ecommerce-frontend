import { getCurrentUser } from '../services/authService.js';
import { updateUser, changePassword } from '../services/userService.js';
import { showToast } from '../components/toast.js';

export const template = `
  <div class="max-w-7xl mx-auto px-6 py-8">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-gray-500 mb-8">
      <a href="#/" class="hover:text-black">Home</a>
      <span>/</span>
      <span class="text-black font-medium">My Account</span>
      <span class="ml-auto text-sm text-gray-500">Welcome! <span id="welcome-name" class="text-red-500 font-medium"></span></span>
    </div>

    <div class="flex gap-16">
      <!-- Left Sidebar -->
      <aside class="w-48 flex-shrink-0 space-y-6 text-sm">
        <div>
          <p class="font-semibold mb-3">Manage My Account</p>
          <ul class="space-y-2 ml-2">
            <li><button id="tab-profile" class="text-red-500 font-medium hover:text-red-600">My Profile</button></li>
          </ul>
        </div>
        <div>
          <p class="font-semibold mb-3">My Orders</p>
          <ul class="space-y-2 ml-2">
            <li><a href="#/orders" class="text-gray-500 hover:text-black">My Returns</a></li>
            <li><a href="#/orders" class="text-gray-500 hover:text-black">My Cancellations</a></li>
          </ul>
        </div>
      </aside>

      <!-- Right Form -->
      <div class="flex-1 max-w-2xl">
        <h2 class="text-xl font-semibold text-red-500 mb-6">Edit Your Profile</h2>
        <form id="profile-form" class="space-y-5">
          <div class="grid grid-cols-2 gap-5">
            <div>
              <label class="block text-sm font-medium mb-1">First Name</label>
              <input type="text" id="profile-firstname" class="w-full bg-gray-100 rounded px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-red-300" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Last Name</label>
              <input type="text" id="profile-lastname" class="w-full bg-gray-100 rounded px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-red-300" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-5">
            <div>
              <label class="block text-sm font-medium mb-1">Email</label>
              <input type="email" id="profile-email" class="w-full bg-gray-100 rounded px-4 py-2.5 text-sm outline-none" readonly />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Address</label>
              <input type="text" id="profile-street" class="w-full bg-gray-100 rounded px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-red-300" placeholder="Street address" />
            </div>
          </div>

          <div>
            <p class="text-sm font-semibold mb-3">Password Changes</p>
            <div class="space-y-3">
              <input type="password" id="old-password" class="w-full bg-gray-100 rounded px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-red-300" placeholder="Current Password" />
              <input type="password" id="new-password" class="w-full bg-gray-100 rounded px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-red-300" placeholder="New Password" />
              <input type="password" id="confirm-password" class="w-full bg-gray-100 rounded px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-red-300" placeholder="Confirm New Password" />
            </div>
          </div>

          <div class="flex justify-end gap-4 pt-2">
            <button type="button" id="cancel-btn" class="px-8 py-3 text-sm font-medium hover:bg-gray-50 rounded transition-colors">Cancel</button>
            <button type="submit" class="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded text-sm font-medium transition-colors">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  </div>
`;

export async function init() {
  const user = getCurrentUser();
  if (!user) return;

  const nameEl = document.getElementById('welcome-name');
  if (nameEl) nameEl.textContent = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email;

  const addr = user.address || {};
  document.getElementById('profile-firstname').value = user.firstName || '';
  document.getElementById('profile-lastname').value = user.lastName || '';
  document.getElementById('profile-email').value = user.email || '';
  document.getElementById('profile-street').value = addr.street || '';

  document.getElementById('cancel-btn').addEventListener('click', () => {
    document.getElementById('profile-form').reset();
    document.getElementById('profile-firstname').value = user.firstName || '';
    document.getElementById('profile-lastname').value = user.lastName || '';
    document.getElementById('profile-email').value = user.email || '';
    document.getElementById('profile-street').value = addr.street || '';
  });

  document.getElementById('profile-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const firstName = document.getElementById('profile-firstname').value.trim();
    const lastName = document.getElementById('profile-lastname').value.trim();
    const street = document.getElementById('profile-street').value.trim();
    const oldPass = document.getElementById('old-password').value;
    const newPass = document.getElementById('new-password').value;
    const confirmPass = document.getElementById('confirm-password').value;

    if (!firstName) { showToast('First name cannot be empty', 'error'); return; }
    if (!lastName) { showToast('Last name cannot be empty', 'error'); return; }

    try {
      await updateUser(user.id, { firstName, lastName, address: { street, houseNumber: addr.houseNumber || '', zipCode: addr.zipCode || '' } });

      if (oldPass || newPass || confirmPass) {
        if (!oldPass) { showToast('Enter your current password', 'error'); return; }
        if (!newPass || newPass.length < 6) { showToast('New password must be at least 6 characters', 'error'); return; }
        if (newPass !== confirmPass) { showToast('Passwords do not match', 'error'); return; }
        changePassword(user.id, oldPass, newPass);
        document.getElementById('old-password').value = '';
        document.getElementById('new-password').value = '';
        document.getElementById('confirm-password').value = '';
      }

      showToast('Profile updated successfully', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  });
}
