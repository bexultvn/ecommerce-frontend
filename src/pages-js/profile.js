import { getCurrentUser } from '../services/authService.js';
import { updateUser, changePassword } from '../services/userService.js';
import { showToast } from '../components/toast.js';

export const template = `
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 py-8">

      <!-- Profile Header -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6 flex items-center gap-4">
        <div id="profile-avatar" class="w-14 h-14 rounded-full bg-gradient-to-br from-red-400 to-red-600 text-white flex items-center justify-center text-2xl font-bold flex-shrink-0"></div>
        <div class="min-w-0">
          <h1 id="profile-display-name" class="text-lg font-bold text-gray-900 truncate"></h1>
          <p id="profile-display-email" class="text-sm text-gray-400 truncate"></p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <!-- Personal Info -->
        <div class="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex flex-col">
          <h2 class="text-base font-semibold mb-5 flex items-center gap-2">
            <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            Personal Information
          </h2>
          <form id="profile-form" class="flex flex-col flex-1 gap-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">First Name</label>
                <input type="text" id="profile-firstname" class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-red-300 focus:border-transparent transition" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Last Name</label>
                <input type="text" id="profile-lastname" class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-red-300 focus:border-transparent transition" />
              </div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Email</label>
                <input type="email" id="profile-email" class="w-full bg-gray-100 border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none text-gray-400 cursor-not-allowed" readonly />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Address</label>
                <input type="text" id="profile-street" class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-red-300 focus:border-transparent transition" placeholder="Street address" />
              </div>
            </div>
            <div class="flex flex-wrap justify-end gap-3 mt-auto pt-2">
              <button type="button" id="cancel-btn" class="px-6 py-2.5 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
              <button type="submit" class="bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">Save Changes</button>
            </div>
          </form>
        </div>

        <!-- Password -->
        <div class="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex flex-col">
          <h2 class="text-base font-semibold mb-5 flex items-center gap-2">
            <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
            Change Password
          </h2>
          <form id="password-form" class="flex flex-col flex-1 gap-4">
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Current Password</label>
              <input type="password" id="old-password" class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-red-300 focus:border-transparent transition" placeholder="••••••••" />
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">New Password</label>
                <input type="password" id="new-password" class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-red-300 focus:border-transparent transition" placeholder="••••••••" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Confirm Password</label>
                <input type="password" id="confirm-password" class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-red-300 focus:border-transparent transition" placeholder="••••••••" />
              </div>
            </div>
            <div class="flex justify-end mt-auto pt-2">
              <button type="submit" class="bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">Update Password</button>
            </div>
          </form>
        </div>

      </div>
    </div>
  </div>
`;

export async function init() {
  const user = getCurrentUser();
  if (!user) return;

  const addr = user.address || {};
  const displayName = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email || 'Account';

  // Populate header
  const avatar = document.getElementById('profile-avatar');
  if (avatar) avatar.textContent = displayName.charAt(0).toUpperCase();
  const nameEl = document.getElementById('profile-display-name');
  if (nameEl) nameEl.textContent = displayName;
  const emailEl = document.getElementById('profile-display-email');
  if (emailEl) emailEl.textContent = user.email || '';

  // Populate form fields
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

    if (!firstName) { showToast('First name cannot be empty', 'error'); return; }
    if (!lastName) { showToast('Last name cannot be empty', 'error'); return; }

    try {
      await updateUser(user.id, { firstName, lastName, address: { street, houseNumber: addr.houseNumber || '', zipCode: addr.zipCode || '' } });
      showToast('Profile updated successfully', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  });

  document.getElementById('password-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const oldPass = document.getElementById('old-password').value;
    const newPass = document.getElementById('new-password').value;
    const confirmPass = document.getElementById('confirm-password').value;

    if (!oldPass) { showToast('Enter your current password', 'error'); return; }
    if (!newPass || newPass.length < 6) { showToast('New password must be at least 6 characters', 'error'); return; }
    if (newPass !== confirmPass) { showToast('Passwords do not match', 'error'); return; }

    try {
      changePassword(user.id, oldPass, newPass);
      document.getElementById('password-form').reset();
      showToast('Password updated successfully', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  });
}
